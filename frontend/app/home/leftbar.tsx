"use client";

import { Arima, Roboto, Smooch_Sans } from "next/font/google";
import Link from "next/link";
import { FaBookmark, FaCalendar, FaHome, FaUser } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaQuestion,
  FaInbox,
  FaExclamationTriangle,
  FaFileContract,
} from "react-icons/fa";
import LogoutButton from "../components/logout-button";
import { useAuth } from "../context/authcontext";

const arimaFont = Arima({
  subsets: ["latin"],
});

const smoochFont = Roboto({
  subsets: ["latin"],
});

export default function LeftBar() {
  const HelpAndSupport = () => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="mt-4 px-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-6 py-4 md:py-3.5 cursor-pointer rounded-lg w-full flex items-center justify-between gap-3.5 group relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white rounded-lg transform scale-90 group-hover:scale-100 transition-all duration-300"></div>
          <div className="flex items-center gap-3.5">
            <span className="text-emerald-400 group-hover:text-white transition-colors duration-300 flex items-center justify-center w-8 h-8 rounded-full bg-black/20 group-hover:bg-black/30">
              <FaQuestion className="text-lg" />
            </span>
            <span className="font-medium tracking-wide text-gray-100 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 text-base md:text-sm">
              Help & Support
            </span>
          </div>

          <span
            className={`text-gray-400 ${
              expanded ? "" : "rotate-180"
            } transition-all duration-150`}
          >
            <FaChevronUp />
          </span>
        </button>

        {expanded && (
          <div className="ml-8 mt-2 flex flex-col gap-1">
            {[
              [
                "Help Center",
                <FaQuestion key="help-center" className="text-sm" />,
              ],
              [
                "Support Inbox",
                <FaInbox key="support-inbox" className="text-sm" />,
              ],
              [
                "Report a Problem",
                <FaExclamationTriangle
                  key="report-problem"
                  className="text-sm"
                />,
              ],
              [
                "Terms and Conditions",
                <FaFileContract key="terms" className="text-sm" />,
              ],
            ].map((item, key) => (
              <Link
                href={"#"}
                className="px-6 py-3 md:py-2.5 rounded-lg w-full flex items-center gap-3 group relative overflow-hidden"
                key={key}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white rounded-lg transform scale-90 group-hover:scale-100 transition-all duration-300"></div>
                <span className="text-emerald-400 group-hover:text-white transition-colors duration-300 flex items-center justify-center w-6 h-6 rounded-full bg-black/20 group-hover:bg-black/30">
                  {item[1]}
                </span>
                <span className="font-medium tracking-wide text-gray-400 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 text-sm">
                  {item[0]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-black/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none">
      <div className="flex gap-4 px-4 md:px-8 py-4 pt-16 md:pt-4 items-center">
        <div
          className={`bg-emerald-600 ${arimaFont.className} rounded-xl flex justify-center items-center`}
        >
          <h1 className="text-2xl w-12 flex justify-center items-center h-12 text-center text-black font-bold">
            CR
          </h1>
        </div>
        <h1
          className={`flex justify-center items-center h-12 text-white font-bold ${smoochFont.className} text-lg md:text-base`}
        >
          The Creddit Company
        </h1>
      </div>

      {/* menu */}
      <div className="mt-6 md:mt-10 w-full flex flex-col gap-1 px-2">
        {[
          ["Home", <FaHome key="home-icon" className="text-lg" />, "/home"],
          [
            "Profile",
            <FaUser key="profile-icon" className="text-lg" />,
            "/profile",
          ],
          ["Events", <FaCalendar key="events-icon" className="text-lg" />, "#"],
          ["Saved", <FaBookmark key="saved-icon" className="text-lg" />, "#"],
          ["Settings", <FaGear key="settings-icon" className="text-lg" />, "#"],
        ].map((item, key) => (
          <Link
            href={item[2] as string}
            className="px-6 py-4 md:py-3.5 rounded-lg w-full flex items-center gap-3.5 group relative overflow-hidden"
            key={key}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white rounded-lg transform scale-90 group-hover:scale-100 transition-all duration-300"></div>
            <span className="text-emerald-400 group-hover:text-white transition-colors duration-300 flex items-center justify-center w-8 h-8 rounded-full bg-black/20 group-hover:bg-black/30">
              {item[1]}
            </span>
            <span className="font-medium tracking-wide text-gray-100 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 text-base md:text-sm">
              {item[0]}
            </span>
          </Link>
        ))}
      </div>

      <div className="w-full h-1 border-b-5 border-b-gray-800 mt-2"></div>

      <HelpAndSupport />

      <div className="flex flex-col mt-auto mb-4 px-4">
        <div className="mt-8 w-full px-4 py-3 bg-black/20 rounded-lg flex items-center gap-4 mb-2">
          {/* User info */}
          <UserInfo />
        </div>

        {/* Logout button */}
        <div className="px-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

function UserInfo() {
  const { user } = useAuth();
  const userInitial = user?.email.charAt(0).toUpperCase() || "U";

  return (
    <>
      <div className="w-9 h-9 sm:w-8 sm:h-8 bg-emerald-600 rounded-full flex text-sm justify-center items-center font-bold">
        {userInitial}
      </div>
      <div className="flex flex-col">
        <h1 className="text-sm font-medium text-white">
          {user?.email.split("@")[0]}
        </h1>
        <p className="text-xs text-gray-400 truncate max-w-[180px]">
          {user?.email}
        </p>
      </div>
    </>
  );
}
