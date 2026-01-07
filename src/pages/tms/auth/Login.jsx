import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "../../../store/feature/auth/authSlice";
import { AiOutlineUser, AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import Logo from "../../../assets/Logo2.png";
import { login } from "../../../services/AuthService"; // import your API call
import {  useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) return;

  setLoading(true);
  setError("");

 try {
  const data = await login({ email, password });
  console.log("login data ============>", data);

  if (data.success) {
    localStorage.setItem("accessToken", data.accessToken);
    dispatch(setLogin({ user: data.user, tokens: { access: data.accessToken } }));
    toast.success(data.message || "Logged in successfully");
    navigate("/dashboard");
  } else {
    toast.error(data.message || "Login failed");
  }
} catch (err) {
  console.error("Catch error:", err);
  setError(err.response?.data?.message || err.message || "Login failed");
  toast.error(err.response?.data?.message || "Login failed");
}
finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Fleetlio Logo" className="h-36 object-contain" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-slate-900 text-center">
          Login to Fleetlio
        </h1>
        <p className="text-slate-500 text-sm text-center mt-1 mb-8">
          Manage trips, fleet and billing
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Email */}
          <div className="relative">
            <AiOutlineUser className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-300
                         text-slate-800 placeholder-slate-400
                         focus:outline-none focus:border-orange-500
                         transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div
              className="absolute left-3 top-3.5 text-slate-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineUnlock size={18} /> : <AiOutlineLock size={18} />}
            </div>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-300
                         text-slate-800 placeholder-slate-400
                         focus:outline-none focus:border-orange-500
                         transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600
                       text-white font-medium py-3 rounded-lg
                       transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
