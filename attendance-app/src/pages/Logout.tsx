import React from "react";
import "../styles/Log.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

interface LogoutProps {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
}

const Logout = ({ setIsAuth, setUserEmail }: LogoutProps) => {
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth);
    localStorage.clear();
    setIsAuth(false);
    setUserEmail(null);
    navigate("/login");
  };


  return (
    <div className="Container">
      <div className="logForm">
        <h2>Logout</h2>
        <button onClick={logout}>GoogleでLogout</button>
      </div>
    </div>
  );
};

export default Logout;
