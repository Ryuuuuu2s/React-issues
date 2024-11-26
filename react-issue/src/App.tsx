import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Setting from "./pages/Setting";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Navbar from "./components/Navbar";
import Report from "./pages/Report";
import { useEffect, useState } from "react";
import React from "react";
import { Transaction } from "./types/index";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { format } from "date-fns";
import { formatMonth } from "./utils/formatting";
import { Schema } from "./validations/schema";
import { theme } from "./theme/theme";
import { ThemeProvider } from "@emotion/react";

import { auth } from "./firebase"; // Firebaseのauthをインポート
import { query, where } from "firebase/firestore";

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(
    Boolean(localStorage.getItem("isAuth"))
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // FireBaseエラーかどうかを判断する型ガード
  function isFirebaseError(
    err: unknown
  ): err is { code: string; message: string } {
    return typeof err === "object" && err !== null && "code" in err;
  }

  // firebaseからデータを全て取得
  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "Transactions"));

  //       const transactionsData = querySnapshot.docs.map((doc) => {
  //         return {
  //           ...doc.data(),
  //           id: doc.id,
  //         } as Transaction;
  //       });
  //       setTransactions(transactionsData);
  //     } catch (err) {
  //       if (isFirebaseError(err)) {
  //         console.error("FireBaseエラーは：", err);
  //       } else {
  //         console.error("一般的なエラーは：", err);
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchTransactions();
  // }, []);

  // firebaseからデータを全て取得（ログイン中のユーザーのみ）
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (auth.currentUser) {
          const q = query(
            collection(db, "Transactions"),
            where("author.id", "==", auth.currentUser.uid)
          );
          const querySnapshot = await getDocs(q);

          const transactionsData = querySnapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              id: doc.id,
            } as Transaction;
          });
          setTransactions(transactionsData);
        }
      } catch (err) {
        if (isFirebaseError(err)) {
          console.error("FireBaseエラーは：", err);
        } else {
          console.error("一般的なエラーは：", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [auth.currentUser]);

  // 1月分のデータのみ取得
  const monthTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  // 取引を登録する処理
  // const handleSaveTransaction = async (transaction: Schema) => {
  //   try {
  //     // firebaseにデータを保存
  //     const docRef = await addDoc(collection(db, "Transactions"), transaction);

  //     const newTransaction = {
  //       id: docRef.id,
  //       ...transaction,
  //     } as Transaction;
  //     setTransactions((prevTransaction) => [
  //       ...prevTransaction,
  //       newTransaction,
  //     ]);
  //   } catch (err) {
  //     if (isFirebaseError(err)) {
  //       console.error("FireBaseエラーは：", err);
  //     } else {
  //       console.error("一般的なエラーは：", err);
  //     }
  //   }
  // };

  // 取引を登録する処理(ユーザー情報を追加)
  const handleSaveTransaction = async (transaction: Schema) => {
    try {
      // ユーザー情報をtransactionに追加
      const transactionWithUser = {
        ...transaction,
        author: {
          username: auth.currentUser?.displayName,
          id: auth.currentUser?.uid,
          photoURL: auth.currentUser?.photoURL,
        },
        createdAt: new Date().getTime(),
      };

      // firebaseにデータを保存
      const docRef = await addDoc(
        collection(db, "Transactions"),
        transactionWithUser
      );

      const newTransaction = {
        id: docRef.id,
        ...transactionWithUser,
      } as Transaction;
      setTransactions((prevTransaction) => [
        ...prevTransaction,
        newTransaction,
      ]);
    } catch (err) {
      if (isFirebaseError(err)) {
        console.error("FireBaseエラーは：", err);
      } else {
        console.error("一般的なエラーは：", err);
      }
    }
  };

  // 取引を削除する処理
  const handleDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    try {
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];
      console.log(idsToDelete);

      for (const id of idsToDelete) {
        // firebaseからデータを削除
        await deleteDoc(doc(db, "Transactions", id));
      }
      const filteredTransactions = transactions.filter(
        (transaction) => !idsToDelete.includes(transaction.id)
      );
      setTransactions(filteredTransactions);
    } catch (err) {
      if (isFirebaseError(err)) {
        console.error("FireBaseエラーは：", err);
      } else {
        console.error("一般的なエラーは：", err);
      }
    }
  };

  // 取引を更新する処理
  const handleUpdateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      // firebaseのデータを更新
      const docRef = doc(db, "Transactions", transactionId);
      await updateDoc(docRef, transaction);

      // フロント更新
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId ? { ...t, ...transaction } : t
      ) as Transaction[];
      setTransactions(updatedTransactions);
    } catch (err) {
      if (isFirebaseError(err)) {
        console.error("FireBaseエラーは：", err);
      } else {
        console.error("一般的なエラーは：", err);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar isAuth={isAuth} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isAuth={isAuth}
                monthTransactions={monthTransactions}
                setCurrentMonth={setCurrentMonth}
                onSaveTransaction={handleSaveTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                onUpdateTransaction={handleUpdateTransaction}
              />
            }
          ></Route>
          <Route
            path="/report"
            element={
              <Report
                isAuth={isAuth}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                monthTransactions={monthTransactions}
                isLoading={isLoading}
                onDeleteTransaction={handleDeleteTransaction}
              />
            }
          ></Route>
          <Route
            path="/createpost"
            element={<CreatePost isAuth={isAuth} />}
          ></Route>
          <Route
            path="/setting"
            element={<Setting isAuth={isAuth} setIsAuth={setIsAuth} />}
          ></Route>
          <Route
            path="/login"
            element={<Login setIsAuth={setIsAuth} />}
          ></Route>
          <Route
            path="/logout"
            element={<Logout setIsAuth={setIsAuth} />}
          ></Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
