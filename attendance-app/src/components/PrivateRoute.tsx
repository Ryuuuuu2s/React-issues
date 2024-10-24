import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  isAuth: boolean;
  children: JSX.Element;
}

// ログインしていない状態だとログインページにリダイレクトする
const PrivateRoute = ({ isAuth, children }: PrivateRouteProps) => {
  return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;