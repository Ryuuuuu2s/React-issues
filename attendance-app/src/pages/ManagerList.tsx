import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/ManagerList.css";

interface Manager {
  username: string;
  email: string;
  firstAttendanceDate: string;
}

const ManagerList = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [sortOption, setSortOption] = useState<"name" | "date">("name");

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "record"));
        const managerList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            username: data.author.username,
            email: data.author.email,
            firstAttendanceDate:
              data.attendanceDate + " " + data.attendanceTime,
          };
        }) as Manager[];

        // 重複を排除し、最初の出勤日を取得
        const uniqueManagers = Array.from(
          new Set(managerList.map((manager) => manager.email))
        )
          .map((email) => {
            const manager = managerList.find(
              (manager) => manager.email === email
            );
            return manager;
          })
          .filter((manager): manager is Manager => manager !== undefined);

        setManagers(uniqueManagers);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      }
    };

    fetchManagers();
  }, []);

  const sortedManagers = [...managers].sort((a, b) => {
    if (sortOption === "name") {
      return a.username.localeCompare(b.username);
    } else {
      return (
        new Date(a.firstAttendanceDate).getTime() -
        new Date(b.firstAttendanceDate).getTime()
      );
    }
  });

  return (
    <div className="Container">
      <div className="Box">
        <div className="sort-options">
          <label>
            <input
              type="radio"
              value="name"
              checked={sortOption === "name"}
              onChange={() => setSortOption("name")}
            />
            名前順
          </label>
          <label>
            <input
              type="radio"
              value="date"
              checked={sortOption === "date"}
              onChange={() => setSortOption("date")}
            />
            初回出勤日順
          </label>
        </div>
        <div className="ManagerList">
          <ul className="ManagerList-ul">
            {/* リストヘッダー */}
            <li className="ManagerList-li">
              <div className="user">
                <p>利用者</p>
              </div>
              <div className="email">
                <p>メールアドレス</p>
              </div>
              <div className="date">
                <p>初回出勤日</p>
              </div>
            </li>

            {/* 一覧 */}
            {sortedManagers.map((manager, index) => (
              <li key={index} className="ManagerList-li">
                <div className="user">
                  <p>{manager.username}</p>
                </div>
                <div className="email">
                  <p>{manager.email}</p>
                </div>
                <div className="date">
                  <p>{manager.firstAttendanceDate}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagerList;
