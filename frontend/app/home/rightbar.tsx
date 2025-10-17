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
import {
  FaApple,
  FaBattleNet,
  FaBell,
  FaBook,
  FaChevronRight,
  FaCubesStacked,
  FaDollarSign,
  FaGear,
  FaMagnifyingGlass,
  FaMicrosoft,
  FaSteam,
} from "react-icons/fa6";
import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaQuestion,
  FaInbox,
  FaExclamationTriangle,
  FaFileContract,
} from "react-icons/fa";

import UserData from "../../data/users.json";
import Image from "next/image";

const arimaFont = Arima({
  subsets: ["latin"],
});

const smoochFont = Roboto({
  subsets: ["latin"],
});

export default function RightBar() {
  return (
    <div className="w-full h-full max-h-[97vh] scrollbar-hide pb-4 overflow-y-scroll">
      {/* top icons */}
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

      {/* search box */}
      <div className="px-3 pt-4 flex items-center mt-4">
        <FaMagnifyingGlass className="relative left-8 text-gray-300" />
        <input
          type="search"
          name="name_search"
          id="id_search"
          className="pl-12 py-2 w-full mr-4 text-xl outline-none rounded-lg bg-gray-800"
          placeholder="Search"
          autoComplete="off"
        />
      </div>

      {/* your pages */}
      <div className="pt-4 mt-4">
        <h1 className="px-8 text-gray-300 uppercase text-sm">Your Pages</h1>
        <div className="w-full h-1 border-b-3 border-b-gray-800 mt-3"></div>

        <div className="mt-4 px-8 flex flex-col gap-3">
          {[
            ["Steam Financials", <FaSteam key="steam-icon" />],
            ["Microsoft Finance", <FaMicrosoft key="microsoft-icon" />],
            ["Apple Stocks Daily (ASD)", <FaApple key="apple-icon" />],
          ].map((i, key) => (
            <div
              className="flex items-center gap-2 text-gray-300 cursor-pointer"
              key={key}
            >
              <div className="bg-gray-800 px-4 py-3 text-2xl rounded-md flex items-center">
                {i[1]}
              </div>
              <h1 className="font-bold">{i[0]}</h1>
            </div>
          ))}

          <button
            className="mt-4 text-gray-400 hover:text-gray-200 transition-all duration-100 bg-gray-800 py-3 rounded-md cursor-pointer flex justify-center items-center gap-1 hover:gap-2
          "
          >
            See More <FaChevronRight />
          </button>
        </div>
      </div>

      {/* your groups */}
      <div className="pt-4 mt-4">
        <h1 className="px-8 text-gray-300 uppercase text-sm">Your Groups</h1>
        <div className="w-full h-1 border-b-3 border-b-gray-800 mt-3"></div>

        <div className="mt-4 px-8 flex flex-col gap-3">
          {[
            ["Talk Shit Go", <FaCubesStacked key="cubes-icon" />],
            ["Finance 101", <FaBook key="book-icon" />],
            ["The Expensive Podcast", <FaDollarSign key="dollar-icon" />],
          ].map((i, key) => (
            <div
              className="flex items-center gap-2 text-gray-300 cursor-pointer"
              key={key}
            >
              <div className="bg-gray-800 px-4 py-3 text-2xl rounded-md flex items-center">
                {i[1]}
              </div>
              <h1 className="font-bold">{i[0]}</h1>
            </div>
          ))}

          <button
            className="mt-4 text-gray-400 hover:text-gray-200 transition-all duration-100 bg-gray-800 py-3 rounded-md cursor-pointer flex justify-center items-center gap-1 hover:gap-2
          "
          >
            See More <FaChevronRight />
          </button>
        </div>
      </div>

      {/* friends */}
      <div className="pt-4 mt-4">
        <h1 className="px-8 text-gray-300 uppercase text-sm">Friends</h1>
        <div className="w-full h-1 border-b-3 border-b-gray-800 mt-3"></div>

        <div className="mt-4 px-8 flex flex-col gap-3">
          {["Cat-Cool", "Stupid-Steel", "Rich-Runner"].map((i, key) => (
            <div
              className="flex items-center gap-4 text-gray-300 cursor-pointer"
              key={key}
            >
              <div
                className="px-4 py-3 text-2xl rounded-md flex items-center h-12 w-12"
                style={{
                  backgroundImage: `url(${UserData[key].avatar})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              ></div>
              <h1 className="font-bold text-xl">{i}</h1>
            </div>
          ))}

          <button
            className="mt-4 text-gray-400 hover:text-gray-200 transition-all duration-100 bg-gray-800 py-3 rounded-md cursor-pointer flex justify-center items-center gap-1 hover:gap-2
          "
          >
            See More <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
