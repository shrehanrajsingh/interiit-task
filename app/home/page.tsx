import { Roboto } from "next/font/google";
import LeftBar from "./leftbar";
import MainSection from "./mainsection";
import RightBar from "./rightbar";

const robotoFont = Roboto({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-800 h-screen flex p-4 pb-0 overflow-hidden max-h-screen">
      <div className="h-full w-full bg-black/30 rounded-lg grow text-white grid grid-cols-14">
        {/* left bar */}
        <div className="col-span-3">
          <LeftBar />
        </div>

        {/* main section */}
        <div className="col-span-8">
          <MainSection />
        </div>

        {/* right bar */}
        <div className="col-span-3">
          <RightBar />
        </div>
      </div>
    </div>
  );
}
