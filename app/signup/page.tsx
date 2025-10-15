"use client";

import { Roboto } from "next/font/google";
import Link from "next/link";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa6";

const robotoFont = Roboto({
  subsets: ["latin"],
});

export default function Signup() {
  return (
    <div className="w-full h-screen overflow-hidden bg-black text-white grid grid-cols-5">
      <div className="col-span-2 flex justify-center items-center w-full h-full">
        <div className={`h-2/3 w-2/3 ${robotoFont.className}`}>
          <h1 className={`text-4xl font-bold text-gray-300`}>
            Welcome to Creddit
          </h1>
          <h6 className="mt-2 text-gray-400">Create your account</h6>

          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label
                htmlFor="input_username"
                className="block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <input
                type="text"
                id="input_username"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your username"
                autoComplete="off"
              />
            </div>

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
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your username"
                autoComplete="off"
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
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full cursor-pointer py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Create Account
              </button>
            </div>

            <div className="pt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700 mb-4"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-black text-gray-400 font-medium">
                  Sign up with
                </span>
              </div>
            </div>

            <div className="w-full flex justify-center gap-6 mt-4">
              <button className="p-3 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-200 transform hover:scale-105">
                <FaApple className="text-xl" />
              </button>
              <button className="p-3 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-200 transform hover:scale-105">
                <FaGoogle className="text-xl" />
              </button>
              <button className="p-3 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-200 transform hover:scale-105">
                <FaFacebook className="text-xl" />
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  href={"login"}
                  className="text-indigo-500 hover:text-indigo-400 font-medium transition-colors duration-200 ml-1"
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
