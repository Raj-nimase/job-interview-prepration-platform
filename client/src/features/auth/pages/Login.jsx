import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Login = () => {
  const [flipped, setFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { loginUser, registerUser, loading } = useAuth();

  // separate forms
  const signupForm = useForm();
  const loginForm = useForm();

  const onSubmit = async (data, isSignup) => {
    const payload = {
      name: isSignup ? data.name : undefined,
      email: data.email,
      password: data.password,
    };

    try {
      const res = isSignup
        ? await registerUser(payload)
        : await loginUser(payload);

      const user = res?.user;
      if (!user) {
        throw new Error("Invalid response: missing user");
      }

      toast.success(
        isSignup ? "Registration successful" : "Logged in successfully",
      );

      if (isSignup) signupForm.reset();
      else loginForm.reset();

      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.message || "Authentication failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-emerald-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center pt-24 sm:pt-28 justify-center min-h-screen bg-background overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-40"
      >
        <source src="/photo/Login-video.mov" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 bg-background/60 dark:bg-background/40"
        aria-hidden="true"
      />
      <div className="relative z-10 perspective-[1000px] w-full max-w-[400px] mx-4 sm:mx-6">
        <div
          className={`relative w-full min-h-[520px] sm:min-h-[550px] transition-transform duration-700 transform-style-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Sign Up Card */}
          <div className="absolute w-full h-full bg-card/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border p-6 sm:p-8 backface-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-emerald-500 mb-4 ">
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
                className={`w-full px-4 py-2.5 bg-muted/50 border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  signupForm.formState.errors.name
                    ? "border-destructive"
                    : "border-border"
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
                className={`w-full px-4 py-2.5 bg-muted/50 border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  signupForm.formState.errors.email
                    ? "border-destructive"
                    : "border-border"
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
                  className={`w-full px-4 py-2.5 pr-10 bg-muted/50 border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    signupForm.formState.errors.password
                      ? "border-destructive"
                      : "border-border"
                  }`}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
              {signupForm.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {signupForm.formState.errors.password.message}
                </p>
              )}

              <div className="flex items-center text-foreground gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="text-sm">Remember me</span>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl font-semibold shadow-md hover:opacity-90 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all duration-200"
              >
                Sign Up
              </button>
            </form>
            <div
              onClick={() => setFlipped(true)}
              className="mt-4 text-sm text-center text-muted-foreground cursor-pointer hover:text-emerald-500 transition"
            >
              Already have an account? Login
            </div>
          </div>

          {/* Login Card */}
          <div className="absolute w-full h-full bg-card/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border p-6 sm:p-8 rotate-y-180 backface-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-emerald-500 mb-4  ">
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
                className={`w-full px-4 py-2.5 bg-muted/50 border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  loginForm.formState.errors.email
                    ? "border-destructive"
                    : "border-border"
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
                  className={`w-full px-4 py-2.5 pr-10 bg-muted/50 border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    loginForm.formState.errors.password
                      ? "border-destructive"
                      : "border-border"
                  }`}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {loginForm.formState.errors.password.message}
                </p>
              )}

              <div className="flex items-center text-foreground gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="text-sm">Remember me</span>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl font-semibold shadow-md hover:opacity-90 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all duration-200"
              >
                Login
              </button>
            </form>
            <div
              onClick={() => setFlipped(false)}
              className="mt-4 text-sm text-center text-muted-foreground cursor-pointer hover:text-emerald-500 transition"
            >
              Don’t have an account? Sign Up
            </div>
          </div>
        </div>
      </div>

      <style>{`
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
