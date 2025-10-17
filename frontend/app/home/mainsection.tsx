"use client";

import { Roboto } from "next/font/google";
import {
  FaBookmark,
  FaComment,
  FaMagnifyingGlass,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa6";
import { motion } from "framer-motion";
import { useAuth } from "../context/authcontext";
import { useState } from "react";
import CommentSection from "./commentsection";

import comments from "../../data/comments.json";
import users from "../../data/users.json";

const robotoFont = Roboto({
  subsets: ["latin"],
});

export default function MainSection() {
  const { user } = useAuth();
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <motion.div
        className="px-4 sm:px-8 pt-4 flex items-center flex-shrink-0 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaMagnifyingGlass className="relative left-8 text-gray-300" />
        <input
          type="search"
          name="name_search"
          id="id_search"
          className="pl-12 py-2 w-full sm:w-4/5 md:w-3/5 text-lg sm:text-xl outline-none rounded-lg bg-gray-800 focus:ring-2 focus:ring-emerald-500/40 transition-all"
          placeholder="Search"
          autoComplete="off"
        />
      </motion.div>

      {showCommentModal && (
        <CommentSection
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          comments={comments}
          users={users}
        />
      )}

      <motion.div
        className="grow py-4 overflow-y-auto max-h-[87vh] scrollbar-hide min-h-0 bg-gray-800/70 backdrop-blur-md mt-4 sm:mt-8 rounded-lg flex-shrink overflow-x-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="px-4 sm:px-8 pb-4 font-bold">
          <motion.div
            className="flex gap-2 sm:gap-4 items-center py-3 px-4 sm:px-6 bg-black/30 rounded-lg overflow-x-auto scrollbar-hide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button className="px-3 sm:px-4 py-2 cursor-pointer rounded-md bg-emerald-600 hover:bg-emerald-700 transition-colors text-black text-xs sm:text-sm font-medium whitespace-nowrap">
              Trending
            </button>
            <button className="px-3 sm:px-4 py-2 cursor-pointer rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-xs sm:text-sm text-gray-300 whitespace-nowrap">
              Following
            </button>
            <button className="px-3 sm:px-4 py-2 cursor-pointer rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-xs sm:text-sm text-gray-300 whitespace-nowrap">
              Nearby
            </button>
          </motion.div>
        </div>

        <div className="w-full px-4 sm:px-8">
          <motion.div
            className="px-4 sm:px-8 py-4 sm:py-6 flex flex-col bg-black/30 rounded-lg mb-8 border border-gray-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-700 flex justify-center items-center text-xl font-bold rounded-full shadow-lg">
                S
              </div>
              <div>
                <h1 className="text-lg text-gray-200 font-bold">
                  shrehanrajsingh
                </h1>
                <h3 className="text-sm text-gray-400">26 mins ago</h3>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg shadow-lg">
              <video
                src="/post-video.mp4"
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                controls
              ></video>
            </div>

            <p
              className={`mt-6 text-gray-300 text-base sm:text-lg ${robotoFont.className}`}
            >
              The Black-Scholes equation is one of the most influential formulas
              in finance. Developed by Fischer Black, Myron Scholes, and later
              extended by Robert Merton, it provides a theoretical framework for
              pricing European-style options — financial contracts that give the
              right (but not the obligation) to buy or sell an asset at a fixed
              price in the future.
            </p>

            <div className="w-full h-1 border-b border-gray-700/50 mt-6"></div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
              <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 sm:space-x-4">
                <button className="flex items-center gap-2 text-gray-300 py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-800 transition-all duration-100 group">
                  <div className="bg-gray-700 p-1.5 sm:p-2 rounded-full group-hover:bg-emerald-500/20 transition-all duration-300 shadow-lg">
                    <FaThumbsUp className="text-sm sm:text-lg group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium group-hover:font-bold">
                    Like
                  </span>
                  <span className="text-xs bg-gray-700 group-hover:bg-emerald-500/20 px-2 py-0.5 rounded-md ml-1 transition-all">
                    24
                  </span>
                </button>

                <button className="flex items-center gap-2 text-gray-300 py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-800 transition-all duration-100 group">
                  <div className="bg-gray-700 p-1.5 sm:p-2 rounded-full group-hover:bg-red-500/20 transition-all duration-300 shadow-lg">
                    <FaThumbsDown className="text-sm sm:text-lg group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium group-hover:font-bold">
                    Dislike
                  </span>
                  <span className="text-xs bg-gray-700 group-hover:bg-red-500/20 px-2 py-0.5 rounded-md ml-1 transition-all">
                    3
                  </span>
                </button>

                <button
                  onClick={() => setShowCommentModal(true)}
                  className="flex items-center gap-2 text-gray-300 py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-800 transition-all duration-100 group"
                >
                  <div className="bg-gray-700 p-1.5 sm:p-2 rounded-full group-hover:bg-blue-500/20 transition-all duration-300 shadow-lg">
                    <FaComment className="text-sm sm:text-lg group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium group-hover:font-bold">
                    Comment
                  </span>
                  <span className="text-xs bg-gray-700 group-hover:bg-blue-500/20 px-2 py-0.5 rounded-md ml-1 transition-all">
                    {comments.length}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
