import React from "react";
import "../styles/AllList.css";
import { CSVLink } from "react-csv";

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

interface AllListProps {
  records: Record[];
}

const AllList = ({ records }: AllListProps) => {
  const headers = [
    { label: "名前", key: "author.username" },
    { label: "メールアドレス", key: "author.email" },
    { label: "日付", key: "attendanceDate" },
    { label: "出勤時刻", key: "attendanceTime" },
    { label: "退勤時刻", key: "leavingTime" },
    { label: "打刻位置", key: "address" },
    { label: "備考欄", key: "note" },
  ];

  const csvData = records.map((record) => ({
    "author.username": record.author.username,
    "author.email": record.author.email,
    attendanceDate: record.attendanceDate,
    attendanceTime: record.attendanceTime || "未",
    leavingTime: record.leavingTime || "未",
    address: record.address,
    note: record.note || "",
  }));

  return (
    <div className="Container">
      <div className="Box">
        <CSVLink className="CSVLink" data={csvData} headers={headers} filename={"records.csv"}>CSVエクスポート
        </CSVLink>
        <div className="CustomerList">
          <ul className="CustomerList-ul">
            {/* リストヘッダー */}
            <li className="CustomerList-li">
              <div className="name">
                <p>名前</p>
              </div>
              <div className="date">
                <p>日付</p>
              </div>
              <div className="start">
                <p>出勤時刻</p>
              </div>
              <div className="end">
                <p>退勤時刻</p>
              </div>
              <div className="location">
                <p>打刻位置</p>
              </div>
              <div className="note">
                <span className="note-inner">
                  <p>備考欄</p>
                </span>
              </div>
            </li>

            {/* 全部リスト */}
            {records.map((record) => (
              <li key={record.id} className="CustomerList-li">
                <div className="name">
                  <p>{record.author.username}</p>
                </div>
                <div className="date">
                  <p>{record.attendanceDate}</p>
                </div>
                <div className="start">
                  <p>{record.attendanceTime || "未"}</p>
                </div>
                <div className="end">
                  <p>{record.leavingTime || "未"}</p>
                </div>
                <div className="location">
                  <p>{record.address}</p>
                </div>
                <div className="note">
                  <span className="note-inner">
                    <p>{record.note || ""}</p>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AllList;
