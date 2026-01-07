import React, { useState } from "react";
import { FiMenu, FiUser } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logout } from "../../services/AuthService";
import { toggleSidebar } from "../../store/feature/layOut/layoutSlice";

const AppHeader = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("accessToken");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header className="flex items-center justify-between bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center">
        <button
          onClick={() => dispatch(toggleSidebar())}
        >
          <FiMenu size={24} />
        </button>

      </div>

      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center p-2 rounded-full hover:bg-gray-100 transition"
        >
          <FiUser size={22} />
        </button>

        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50">
            <button
              onClick={() => {
                navigate("/profile");
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
