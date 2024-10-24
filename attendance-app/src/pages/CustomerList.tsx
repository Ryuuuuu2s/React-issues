import React, { useState, useEffect } from "react";
import "../styles/CustomerList.css";
import { isLateAttendance, isEarlyLeaving } from "../utils";

interface CustomerListProps {
  records: any[];
  registerNote: (id: string, note: string) => void;
}

const CustomerList = ({ records, registerNote }: CustomerListProps) => {
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const initialNotes = records.reduce((acc, record) => {
      acc[record.id] = record.note || "";
      return acc;
    }, {} as { [key: string]: string });
    setNotes(initialNotes);
  }, [records]);

  const handleNoteChange = (id: string, value: string) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [id]: value,
    }));
  };

  const handleNoteSubmit = (id: string) => {
    registerNote(id, notes[id] || "");
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() + (direction === "prev" ? -1 : 1));
      return newMonth;
    });
  };

  const filteredRecords = records.filter((record) => {
    const recordDate = new Date(record.attendanceDate);
    return (
      recordDate.getFullYear() === currentMonth.getFullYear() &&
      recordDate.getMonth() === currentMonth.getMonth()
    );
  });

  return (
    <div className="Container">
      <div className="Box">
        <div className="month-navigation">
          <button onClick={() => handleMonthChange("prev")}>前の月</button>
          <span>
            {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
          </span>
          <button onClick={() => handleMonthChange("next")}>次の月</button>
        </div>
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

            {/* データ一覧 */}
            {filteredRecords.map((record) => {
              const hasError =
                isLateAttendance(record.attendanceTime) ||
                isEarlyLeaving(record.leavingTime) ||
                record.leavingTime === undefined;

              return (
                <li
                  key={record.id}
                  className={`CustomerList-li ${hasError ? "error" : ""}`}
                >
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
                      <textarea
                        value={notes[record.id] || ""}
                        onChange={(e) =>
                          handleNoteChange(record.id, e.target.value)
                        }
                      />
                      <button onClick={() => handleNoteSubmit(record.id)}>
                        備考
                        <br />
                        追加
                      </button>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
