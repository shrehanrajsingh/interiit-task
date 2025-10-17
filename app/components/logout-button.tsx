"use client";

import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/authcontext";
import { useState } from "react";

export default function LogoutButton() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300 group"
    >
      {isLoggingOut ? (
        <>
          <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-red-400 animate-spin" />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <FaSignOutAlt className="text-sm group-hover:scale-110 transition-transform" />
          <span className="font-medium">Logout</span>
        </>
      )}
    </button>
  );
}
