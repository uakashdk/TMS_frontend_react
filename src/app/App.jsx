import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppRouter from "./router";
import { setLogin, clearAuth } from "../store/feature/auth/authSlice";
import { refreshToken as refreshTokenAPI } from "../services/AuthService";
import Loader from "../component/common/Loader";

const App = () => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    dispatch(clearAuth());
    setAuthChecked(true);
    return;
  }

  const initAuth = async () => {
    try {
      const data = await refreshTokenAPI();

      localStorage.setItem("accessToken", data.accessToken);

      dispatch(
        setLogin({
          user: data.user,
          tokens: { access: data.accessToken },
        })
      );
    } catch (err) {
      dispatch(clearAuth());
    } finally {
      setAuthChecked(true);
    }
  };

  initAuth();

  // ✅ Refresh every 4 minutes (before expiry)
  const interval = setInterval(async () => {
    try {
      const data = await refreshTokenAPI();

      localStorage.setItem("accessToken", data.accessToken);

      dispatch(
        setLogin({
          user: data.user,
          tokens: { access: data.accessToken },
        })
      );
    } catch (err) {
      dispatch(clearAuth());
    }
  }, 4 * 60 * 1000); // 4 minutes

  return () => clearInterval(interval);

}, [dispatch]);


  // ✅ Render AFTER auth check
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
