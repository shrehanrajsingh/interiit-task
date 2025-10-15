"use client";

import { Arima, Roboto, Smooch_Sans } from "next/font/google";
import Link from "next/link";
import {
  FaBookmark,
  FaCalendar,
  FaHome,
  FaUser,
  FaUserAlt,
  FaUserAltSlash,
} from "react-icons/fa";
import { FaBell, FaGear } from "react-icons/fa6";
import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaQuestion,
  FaInbox,
  FaExclamationTriangle,
  FaFileContract,
} from "react-icons/fa";

const arimaFont = Arima({
  subsets: ["latin"],
});

const smoochFont = Roboto({
  subsets: ["latin"],
});

export default function RightBar() {
  return (
    <div className="w-full h-full">
      <div className="flex gap-8 text-xl justify-end px-8 pt-4">
        <div className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-100 hover:scale-105">
          <FaBell />
        </div>
        <div className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-100 hover:scale-105">
          <FaInbox />
        </div>
        <div className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-100 hover:scale-105">
          <FaUserAlt />
        </div>
      </div>
    </div>
  );
}
