import React, { useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";

const Login = () => {
  const [flipped, setFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // separate forms
  const signupForm = useForm();
  const loginForm = useForm();

  const onSubmit = async (data, isSignup) => {
    const url = isSignup
      ? "http://localhost:4000/api/auth/register"
      : "http://localhost:4000/api/auth/login";

    try {
      const res = await axios.post(url, {
        name: isSignup ? data.name : undefined,
        email: data.email,
        password: data.password,
      });

      Swal.fire({
        icon: "success",
        title: isSignup
          ? "Registered Successfully!"
          : "Logged in Successfully!",
        showConfirmButton: false,
        timer: 2000,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const decoded = jwtDecode(res.data.token);
      localStorage.setItem("userId", decoded.id);

      // reset the right form
      if (isSignup) {
        signupForm.reset();
      } else {
        loginForm.reset();
      }

      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div
      className="flex items-center mt-16 justify-center min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] bg-cover"
      
    >
       <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-16 left-0 w-full min-h-scren object-cover"
      >
        <source src="\public\photo\Login-video.mov"
          type="video/mp4"
        />
      </video>
      <div className="z-10 perspective-[1000px]">
        <div
          className={`relative w-[400px] h-[550px] transition-transform duration-700 transform-style-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Sign Up Card */}
          <div className="absolute w-full h-full bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 p-8 backface-hidden">
            <h2 className="text-3xl font-bold text-center text-emerald-400 mb-4">
              Create Account
            </h2>
            <form
              onSubmit={signupForm.handleSubmit((data) => onSubmit(data, true))}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Full Name"
                {...signupForm.register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`w-full px-4 py-2 bg-transparent border rounded text-white placeholder:text-gray-400 focus:outline-none ${
                  signupForm.formState.errors.name
                    ? "border-red-500"
                    : "border-white/20"
                }`}
              />
              {signupForm.formState.errors.name && (
                <p className="text-red-500 text-sm">
                  {signupForm.formState.errors.name.message}
                </p>
              )}

              <input
                type="email"
                placeholder="Email"
                {...signupForm.register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-2 bg-transparent border rounded text-white placeholder:text-gray-400 focus:outline-none ${
                  signupForm.formState.errors.email
                    ? "border-red-500"
                    : "border-white/20"
                }`}
              />
              {signupForm.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {signupForm.formState.errors.email.message}
                </p>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...signupForm.register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full px-4 py-2 pr-10 bg-transparent border rounded text-white placeholder:text-gray-400 focus:outline-none ${
                    signupForm.formState.errors.password
                      ? "border-red-500"
                      : "border-white/20"
                  }`}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-white/70"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
              {signupForm.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {signupForm.formState.errors.password.message}
                </p>
              )}

              <div className="flex items-center text-white gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="text-sm">Remember me</span>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded font-semibold shadow-md hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                Sign Up
              </button>
            </form>
            <div
              onClick={() => setFlipped(true)}
              className="mt-4 text-sm text-center text-gray-300 cursor-pointer hover:text-emerald-400 transition"
            >
              Already have an account? Login
            </div>
          </div>

          {/* Login Card */}
          <div className="absolute w-full h-full bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 p-8 rotate-y-180 backface-hidden">
            <h2 className="text-3xl font-bold text-center text-emerald-400 mb-4">
              Welcome Back
            </h2>
            <form
              onSubmit={loginForm.handleSubmit((data) => onSubmit(data, false))}
              className="space-y-4"
            >
              <input
                type="email"
                placeholder="Email"
                {...loginForm.register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-2 bg-transparent border rounded text-white placeholder:text-gray-400 focus:outline-none ${
                  loginForm.formState.errors.email
                    ? "border-red-500"
                    : "border-white/20"
                }`}
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {loginForm.formState.errors.email.message}
                </p>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...loginForm.register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full px-4 py-2 pr-10 bg-transparent border rounded text-white placeholder:text-gray-400 focus:outline-none ${
                    loginForm.formState.errors.password
                      ? "border-red-500"
                      : "border-white/20"
                  }`}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-white/70"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {loginForm.formState.errors.password.message}
                </p>
              )}

              <div className="flex items-center text-white gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="text-sm">Remember me</span>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded font-semibold shadow-md hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                Login
              </button>
            </form>
            <div
              onClick={() => setFlipped(false)}
              className="mt-4 text-sm text-center text-gray-300 cursor-pointer hover:text-emerald-400 transition"
            >
              Don’t have an account? Sign Up
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Login;
