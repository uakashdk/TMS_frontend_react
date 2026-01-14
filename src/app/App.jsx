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

    // 🔴 No token → logout
    if (!token) {
      dispatch(clearAuth());
      setAuthChecked(true);
      return;
    }

    // 🔵 Token exists → refresh
    const initAuth = async () => {
      try {
        const data = await refreshTokenAPI();

        // ✅ Persist new access token
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
