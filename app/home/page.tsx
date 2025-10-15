import LeftBar from "./leftbar";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-800 h-screen flex p-4">
      <div className="h-full w-full bg-black/30 rounded-lg grow text-white grid grid-cols-14">
        {/* left bar */}
        <div className="col-span-3">
          <LeftBar />
        </div>

        {/* main section */}
        <div className="col-span-8">
          <h1>hi</h1>
        </div>

        {/* right bar */}
        <div className="col-span-3">
          <h1>hi</h1>
        </div>
      </div>
    </div>
  );
}
