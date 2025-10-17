"use client";

import { Roboto } from "next/font/google";
import { useState } from "react";
import LeftBar from "./leftbar";
import MainSection from "./mainsection";
import RightBar from "./rightbar";
import ProtectedRoute from "../components/protected-route";
import { useAuth } from "../context/authcontext";

const robotoFont = Roboto({
  subsets: ["latin"],
});

export default function Home() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen bg-gray-800 h-screen flex p-2 sm:p-4 pb-0 overflow-hidden max-h-screen">
        <div className="h-full w-full bg-black/30 rounded-lg grow text-white grid grid-cols-1 md:grid-cols-14 relative">
          <button
            className="md:hidden absolute top-4 left-4 z-50 bg-gray-800/80 p-2 rounded-lg shadow-lg hover:bg-gray-700/80 transition-colors duration-200"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          <div
            className={`${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 transition-transform duration-300 fixed md:relative z-40 top-0 left-0 h-full bg-black/70 md:bg-transparent w-[270px] sm:w-[300px] md:w-auto md:col-span-3 shadow-2xl md:shadow-none`}
          >
            <LeftBar />
          </div>

          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
              onClick={toggleMobileMenu}
            ></div>
          )}

          <div className="col-span-1 md:col-span-8 pt-14 md:pt-0">
            <MainSection />
          </div>

          <div className="hidden md:block md:col-span-3">
            <RightBar />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
