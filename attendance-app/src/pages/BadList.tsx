import React, { useState } from "react";
import "../styles/BadList.css";
import { isLateAttendance, isEarlyLeaving } from "../utils";

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

interface BadListProps {
  records: Record[];
}

const BadList = ({ records }: BadListProps) => {
  const [filter, setFilter] = useState<"all" | "late" | "early">("all");

  // 遅刻や早退、退勤未登録のレコードをフィルタリング
  const badRecords = records.filter((record) => {
    if (filter === "late") {
      return isLateAttendance(record.attendanceTime);
    } else if (filter === "early") {
      return isEarlyLeaving(record.leavingTime);
    } else {
      return (
        isLateAttendance(record.attendanceTime) ||
        isEarlyLeaving(record.leavingTime) ||
        record.leavingTime === undefined
      );
    }
  });

  return (
    <div className="Container">
      <div className="Box">
        <div className="BadList">
          <div className="filter-options">
            <select value={filter} onChange={(e) => setFilter(e.target.value as "all" | "late" | "early")}>
              <option value="all">全て</option>
              <option value="late">遅刻</option>
              <option value="early">早退</option>
            </select>
          </div>
          <ul className="BadList-ul">
            {/* リストヘッダー */}
            <li className="BadList-li">
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

            {/* データ一覧 */}
            {badRecords.map((record) => (
              <li key={record.id} className="BadList-li error">
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

export default BadList;