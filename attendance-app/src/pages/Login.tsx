import React, { useEffect } from "react";
import "../styles/Log.css";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
  userEmail: string | null;
  managerAddress: string;
}

const Login = ({
  setIsAuth,
  setUserEmail,
  userEmail,
  managerAddress,
}: LoginProps) => {
  const navigate = useNavigate();

  const LogInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", "true");
      setIsAuth(true);
      setUserEmail(result.user.email);
    });
  };

  useEffect(() => {
    if (userEmail) {
      if (userEmail === managerAddress) {
        navigate("/managerlist");
      } else {
        navigate("/");
      }
    }
  }, [userEmail, managerAddress, navigate]);

  return (
    <div className="Container">
      <div className="logForm">
        <h2>Login</h2>
        <button onClick={LogInWithGoogle}>GoogleでLogin</button>
      </div>
    </div>
  );
};

export default Login;