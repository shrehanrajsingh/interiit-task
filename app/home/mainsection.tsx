import { Roboto } from "next/font/google";
import { FaDotCircle, FaThumbsUp } from "react-icons/fa";
import {
  FaAccessibleIcon,
  FaBookmark,
  FaComment,
  FaMagnifyingGlass,
  FaOptinMonster,
  FaPlus,
  FaThumbsDown,
} from "react-icons/fa6";

const robotoFont = Roboto({
  subsets: ["latin"],
});

export default function MainSection() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-8 pt-4 flex items-center flex-shrink-0">
        <FaMagnifyingGlass className="relative left-8 text-gray-300" />
        <input
          type="search"
          name="name_search"
          id="id_search"
          className="pl-12 py-2 w-3/5 text-xl outline-none rounded-lg bg-gray-800"
          placeholder="Search"
          autoComplete="off"
        />
      </div>

      {/* main content div */}
      <div className="grow py-4 overflow-y-auto max-h-[87vh] scrollbar-hide min-h-0 bg-gray-800 mt-8 rounded-lg flex-shrink overflow-x-hidden">
        {/* whats on your mind */}
        <div className="flex justify-center w-full py-2 px-8">
          <div className="w-full bg-black/30 px-4 py-4 flex items-center gap-4 rounded-lg">
            <input
              type="text"
              name="name_woym"
              id="id_woym"
              className="px-2 py-2 w-19/20 bg-gray-800 outline-none"
              placeholder="What's on your mind"
              autoComplete="off"
            />

            <div className="text-2xl mx-auto bg-emerald-600 py-2 px-2 rounded-lg text-gray-800 cursor-pointer">
              <FaPlus />
            </div>
          </div>
        </div>

        {/* trending, following, nearby */}
        <div className="px-8 pb-8 mt-2 font-bold">
          <div className="flex gap-4 items-center py-3 px-6 bg-black/30 rounded-lg">
            <button className="px-4 py-2 cursor-pointer rounded-md bg-emerald-600 text-black text-sm font-medium">
              Trending
            </button>
            <button className="px-4 py-2 cursor-pointer rounded-md bg-gray-700 text-sm text-gray-300">
              Following
            </button>
            <button className="px-4 py-2 cursor-pointer rounded-md bg-gray-700 text-sm text-gray-300">
              Nearby
            </button>
          </div>
        </div>

        {/* sample post */}
        <div className="w-full px-8">
          <div className="px-8 py-4 flex flex-col bg-black/30 rounded-lg">
            {/* top bar */}
            <div className="flex items-center gap-3 w-full text-2xl">
              <div className="w-12 h-12 bg-emerald-600 flex justify-center items-center text-2xl rounded-full">
                S
              </div>
              <div>
                <h1 className="text-lg text-gray-200 font-bold">
                  shrehanrajsingh
                </h1>
                <h3 className="text-sm text-gray-300">26 mins ago</h3>
              </div>
            </div>

            {/* post content */}
            <div className="mt-6">
              <video
                src="/post-video.mp4"
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full"
              ></video>
            </div>

            <p
              className={`mt-6 px-2 text-gray-300 text-xl tracking-wider ${robotoFont.className}`}
            >
              The Black-Scholes equation is one of the most influential formulas
              in finance. Developed by Fischer Black, Myron Scholes, and later
              extended by Robert Merton, it provides a theoretical framework for
              pricing European-style options — financial contracts that give the
              right (but not the obligation) to buy or sell an asset at a fixed
              price in the future.
            </p>

            <div className="w-full h-1 border-b-2 border-b-gray-700 mt-6"></div>

            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex items-center space-x-4">
                <button className="flex items-center gap-2 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 transition-all duration-100 cursor-pointer">
                  <div className="bg-gray-700 p-2 rounded-full group-hover:bg-emerald-500/20 transition-all duration-300 shadow-lg">
                    <FaThumbsUp className="text-lg group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm font-medium group-hover:font-bold">
                    Like
                  </span>
                  <span className="text-xs bg-gray-700 group-hover:bg-emerald-500/20 px-2 py-0.5 rounded-md ml-1 transition-all">
                    24
                  </span>
                </button>

                <button className="flex items-center gap-2 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 cursor-pointer">
                  <div className="bg-gray-700 p-2 rounded-full group-hover:bg-red-500/20 transition-all duration-300 shadow-lg">
                    <FaThumbsDown className="text-lg group-hover:scale-110 group-hover:rotate-180 transition-transform" />
                  </div>
                  <span className="text-sm font-medium group-hover:font-bold">
                    Dislike
                  </span>
                  <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-md ml-1">
                    3
                  </span>
                </button>

                <button className="flex items-center gap-2 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition-all duration-100">
                  <div className="bg-gray-700 p-2 rounded-full">
                    <FaComment className="text-lg group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm font-medium group-hover:font-bold">
                    Comment
                  </span>
                  <span className="text-xs bg-gray-700 group-hover:bg-blue-500/20 px-2 py-0.5 rounded-md ml-1 transition-all">
                    7
                  </span>
                </button>
              </div>

              <button className="flex items-center gap-2 text-gray-300 py-2 px-4 rounded-lg group relative overflow-hidden hover:bg-gray-800 cursor-pointer">
                <div className="bg-gray-700 p-2 rounded-full transition-all duration-300 shadow-lg">
                  <FaBookmark className="text-lg" />
                </div>
                <span className="text-sm font-medium">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
