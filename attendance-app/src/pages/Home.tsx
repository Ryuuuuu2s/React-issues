import React from "react";
import "../styles/Home.css";

interface HomeProps {
  date: string;
  time: string;
  registerAttendance: () => void;
  registerLeaving: () => void;
  address: string | null;
  error: string | null;
}

const Home = ({
  date,
  time,
  registerAttendance,
  registerLeaving,
  address,
  error,
}: HomeProps) => {
  return (
    <div className="Container">
      <div className="Box">
        <div className="Home">
          <h1>{`${date} ${time}`}</h1>
          <div className="ButtonArea">
            <button onClick={registerAttendance}>出勤</button>
            <button onClick={registerLeaving}>退勤</button>
          </div>
          <p>{`住所: ${address ? address : "取得中..."}`}</p>
          <p>{error}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
