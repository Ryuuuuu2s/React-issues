import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import CustomerList from "./pages/CustomerList";
import ManagerList from "./pages/ManagerList";
import BadList from "./pages/BadList";
import Navbar from "./components/common/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import AllList from "./pages/AllList";

// Record型の定義
interface Record {
  id: string;
  attendanceDate: string;
  attendanceTime: string;
  leavingTime?: string;
  author: {
    username: string;
    email: string;
  };
  address: string;
  note?: string;
}

function App() {
  // 管理者のメールアドレス（とりあえず）
  const managerAddress = "terofam0802@gmail.com";

  // ログイン状態の管理
  const [isAuth, setIsAuth] = useState<boolean>(
    localStorage.getItem("isAuth") === "true"
  );

  // ユーザーのメールアドレスの確認（管理者）
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem("userEmail")
  );

  // 年月日と時刻の管理
  const [date, setDate] = useState<string>(new Date().toLocaleDateString());
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  // 現在の位置情報の管理
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 出勤ドキュメントIDの管理
  const [attendanceDocId, setAttendanceDocId] = useState<string | null>(null);

  // 全てのデータを管理
  const [records, setRecords] = useState<Record[]>([]);
  const [userRecords, setUserRecords] = useState<Record[]>([]);

  // 現在の時刻を取得
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setDate(now.toLocaleDateString());
      setTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 位置情報の取得と住所への変換
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setLatitude(lat);
            setLongitude(lon);
            setError(null);
            fetchAddress(lat, lon);
          },
          (err) => {
            setError(err.message);
          }
        );
      } else {
        setError("位置情報が取得できませんでした");
      }
    };

    const fetchAddress = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyAuvd41zwIB033DOQR98jxW3G-r2o53vLE`
        );
        const data = await response.json();
        if (data.status === "OK") {
          const fullAddress = data.results[0].formatted_address;
          const shortAddress = formatAddress(fullAddress);
          setAddress(shortAddress);
        } else {
          setError("住所が見つかりませんでした");
        }
      } catch (error) {
        setError("住所が見つかりませんでした");
      }
    };

    const formatAddress = (address: string) => {
      const parts = address.split(" ");
      return parts.slice(1, 4).join(" ");
    };

    getLocation();
  }, []);

  // 出勤登録処理
  const registerAttendance = async () => {
    try {
      const docRef = await addDoc(collection(db, "record"), {
        attendanceDate: date,
        attendanceTime: time,
        author: {
          username: auth.currentUser?.displayName,
          email: auth.currentUser?.email,
        },
        address,
      });
      setAttendanceDocId(docRef.id);
      alert("出勤登録成功");
      fetchAllRecords(); // 出勤登録後にデータを再取得
    } catch (e) {
      alert("出勤登録失敗");
    }
  };

  // 退勤登録処理
  const registerLeaving = async () => {
    if (!attendanceDocId) {
      alert("出勤データが見つかりません");
      return;
    }
    try {
      const docRef = doc(db, "record", attendanceDocId);
      await updateDoc(docRef, {
        leavingDate: date,
        leavingTime: time,
      });
      alert("退勤登録成功");
      fetchAllRecords();
    } catch (e) {
      alert("退勤登録失敗");
    }
  };

  // 備考登録処理
  const registerNote = async (id: string, note: string) => {
    try {
      const docRef = doc(db, "record", id);
      await updateDoc(docRef, {
        note: note,
      });
      alert("備考登録成功");
      fetchAllRecords();
    } catch (e) {
      alert("備考登録失敗");
    }
  };

  // 全てのデータをfirebaseから取得
  const fetchAllRecords = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "record"));
      const allRecords: Record[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Record[];

      // 日付と時間順
      const sortedRecords = allRecords.sort((a, b) => {
        const dateA = new Date(
          `${a.attendanceDate} ${a.attendanceTime}`
        ).getTime();
        const dateB = new Date(
          `${b.attendanceDate} ${b.attendanceTime}`
        ).getTime();
        return dateB - dateA;
      });

      setRecords(sortedRecords);
    } catch (e) {
      console.error("データの取得に失敗しました", e);
    }
  };

  useEffect(() => {
    fetchAllRecords();
  }, []);

  // recordsまたはauth.currentUserが更新されたときにuserRecordsをフィルタリング
  useEffect(() => {
    const filteredRecords = records.filter(
      (record) => record.author.username === auth.currentUser?.displayName
    );
    setUserRecords(filteredRecords);
  }, [records, auth.currentUser]);

  return (
    <Router>
      <Navbar
        isAuth={isAuth}
        userEmail={userEmail}
        managerAddress={managerAddress}
      />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute isAuth={isAuth}>
              <Home
                date={date}
                time={time}
                registerAttendance={registerAttendance}
                registerLeaving={registerLeaving}
                address={address}
                error={error}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/customerlist"
          element={
            <PrivateRoute isAuth={isAuth}>
              <CustomerList records={userRecords} registerNote={registerNote} />
            </PrivateRoute>
          }
        />
        <Route
          path="/managerlist"
          element={
            <PrivateRoute isAuth={isAuth}>
              <ManagerList />
            </PrivateRoute>
          }
        />
        <Route
          path="/alllist"
          element={
            <PrivateRoute isAuth={isAuth}>
              <AllList records={records} />
            </PrivateRoute>
          }
        />
        <Route
          path="/badlist"
          element={
            <PrivateRoute isAuth={isAuth}>
              <BadList records={records} />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <Login
              setIsAuth={setIsAuth}
              setUserEmail={setUserEmail}
              userEmail={userEmail}
              managerAddress={managerAddress}
            />
          }
        />
        <Route
          path="/logout"
          element={<Logout setIsAuth={setIsAuth} setUserEmail={setUserEmail} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
