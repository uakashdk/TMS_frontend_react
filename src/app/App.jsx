import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppRouter from "./router";
import { setLogin, clearAuth } from "../store/feature/auth/authSlice";
import { refreshToken as refreshTokenAPI } from "../services/AuthService";
import Loader from "../component/common/Loader";

const App = () => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false); // 🔑 flag

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // 🔴 If no token → skip refresh, mark auth check done
    if (!token) {
      dispatch(clearAuth()); // make sure Redux knows user is not logged in
      setAuthChecked(true);
      return;
    }

    // 🔵 Token exists → try refresh
    const initAuth = async () => {
      try {
        const data = await refreshTokenAPI();
        dispatch(
          setLogin({
            user: data.user,
            tokens: { access: data.accessToken },
          })
        );
      } catch (err) {
        dispatch(clearAuth());
      } finally {
        setAuthChecked(true); // 🔑 mark finished
      }
    };

    initAuth();
  }, [dispatch]);

  // ✅ Only render routes after auth check
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
