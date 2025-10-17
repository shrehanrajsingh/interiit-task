"use client";

import { Roboto } from "next/font/google";
import Link from "next/link";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa6";
import { useAuth } from "../context/authcontext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const robotoFont = Roboto({
  subsets: ["latin"],
});

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { register, loading, error, user, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router, clearError]);

  useEffect(() => {
    clearError();

    return () => {
      clearError();
    };
  }, []);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    if (email && password) {
      await register(email, password);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black text-white grid grid-cols-5">
      <div className="col-span-2 flex justify-center items-center w-full h-full">
        <div className={`h-2/3 w-2/3 ${robotoFont.className}`}>
          <h1 className={`text-4xl font-bold text-gray-300`}>
            Welcome to Creddit
          </h1>
          <h6 className="mt-2 text-gray-400">Create your account</h6>

          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="input_email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="input_email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="input_password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="input_password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="input_confirm_password"
                className="block text-sm font-medium text-gray-300"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="input_confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Confirm your password"
                required
              />
              {passwordError && (
                <p className="text-red-400 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>{" "}
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <div className="pt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700 mb-4"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-black text-gray-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="w-full flex justify-center gap-6 mt-4">
              <button
                type="button"
                className="p-3 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-200 transform hover:scale-105"
              >
                <FaApple className="text-xl" />
              </button>
              <button
                type="button"
                className="p-3 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-200 transform hover:scale-105"
              >
                <FaGoogle className="text-xl" />
              </button>
              <button
                type="button"
                className="p-3 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-200 transform hover:scale-105"
              >
                <FaFacebook className="text-xl" />
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  href={"login"}
                  className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors duration-200 ml-1"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="col-span-3">
        <video
          className="w-full h-full object-cover opacity-40"
          src="/signup-bg.mp4"
          autoPlay
          muted
          playsInline
          loop
        />
      </div>
    </div>
  );
}
