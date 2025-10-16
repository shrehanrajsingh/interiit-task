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
          className="px-6 py-3.5 cursor-pointer rounded-lg w-full flex items-center justify-between gap-3.5 group relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white rounded-lg transform scale-90 group-hover:scale-100 transition-all duration-300"></div>
          <div className="flex items-center gap-3.5">
            <span className="text-emerald-400 group-hover:text-white transition-colors duration-300 flex items-center justify-center w-8 h-8 rounded-full bg-black/20 group-hover:bg-black/30">
              <FaQuestion className="text-lg" />
            </span>
            <span className="font-medium tracking-wide text-gray-100 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
              Help & Support
            </span>
          </div>
          {/* <span className="text-gray-400">
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </span> */}

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
              ["Help Center", <FaQuestion className="text-sm" />],
              ["Support Inbox", <FaInbox className="text-sm" />],
              [
                "Report a Problem",
                <FaExclamationTriangle className="text-sm" />,
              ],
              ["Terms and Conditions", <FaFileContract className="text-sm" />],
            ].map((item, key) => (
              <Link
                href={"#"}
                className="px-6 py-2.5 rounded-lg w-full flex items-center gap-3 group relative overflow-hidden"
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
    <div className="w-full h-full flex flex-col">
      <div className="flex gap-4 px-8 py-4">
        <div
          className={`bg-emerald-600 ${arimaFont.className} rounded-xl flex justify-center items-center`}
        >
          <h1 className="text-2xl w-12 flex justify-center items-center h-12 text-center text-black font-bold">
            CR
          </h1>
        </div>
        <h1
          className={`w-24 flex justify-center items-center h-12 text-white font-bold ${smoochFont.className}`}
        >
          The Creddit Company
        </h1>
      </div>

      {/* menu */}
      <div className="mt-10 w-full flex flex-col gap-1 px-2">
        {[
          ["Home", <FaHome className="text-lg" />],
          ["Following", <FaUser className="text-lg" />],
          ["Events", <FaCalendar className="text-lg" />],
          ["Saved", <FaBookmark className="text-lg" />],
          ["Settings", <FaGear className="text-lg" />],
        ].map((item, key) => (
          <Link
            href={"#"}
            className="px-6 py-3.5 rounded-lg w-full flex items-center gap-3.5 group relative overflow-hidden"
            key={key}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white rounded-lg transform scale-90 group-hover:scale-100 transition-all duration-300"></div>
            <span className="text-emerald-400 group-hover:text-white transition-colors duration-300 flex items-center justify-center w-8 h-8 rounded-full bg-black/20 group-hover:bg-black/30">
              {item[1]}
            </span>
            <span className="font-medium tracking-wide text-gray-100 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
              {item[0]}
            </span>
          </Link>
        ))}
      </div>

      <div className="w-full h-1 border-b-5 border-b-gray-800 mt-2"></div>

      <HelpAndSupport />

      <div className="flex items-center mt-auto mb-4 ml-8">
        <div className="mt-8 w-4/5 rounded-full flex items-center gap-4">
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex text-sm justify-center items-center font-bold">
            S
          </div>

          <h1 className="text-lg">Shrehan</h1>
        </div>
      </div>
    </div>
  );
}
