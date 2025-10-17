"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../context/authcontext";
import ProtectedRoute from "../components/protected-route";
import Link from "next/link";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import { authApi } from "../lib/api";
import { AxiosError } from "axios";

interface UserProfile {
  id: number;
  email: string;
  is_active: boolean;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await authApi.getProfile();
        setProfile(response.data as SetStateAction<UserProfile | null>);
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error("Profile fetch error:", axiosError);

        console.error("Error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          headers: axiosError.response?.headers,
        });

        // Type assertion for response data
        const responseData = axiosError.response?.data as
          | { detail?: string }
          | undefined;
        setError(responseData?.detail || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/home"
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <FaArrowLeft /> Back to Home
          </Link>

          <motion.div
            className="bg-gray-800/70 backdrop-blur-md p-8 rounded-xl shadow-lg border border-gray-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <FaSpinner className="animate-spin text-3xl text-emerald-500" />
                <span className="ml-3 text-emerald-500">
                  Loading profile data...
                </span>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg text-red-300">
                <p className="font-bold mb-2">Error loading profile:</p>
                <p>{error}</p>
                <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400">Debug Info:</p>
                  <p className="text-sm text-gray-400">
                    User object exists: {user ? "Yes" : "No"}
                  </p>
                  <p className="text-sm text-gray-400">
                    User email: {user?.email || "Not available"}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                    {profile?.email.charAt(0).toUpperCase() ||
                      user?.email.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h2 className="text-xl font-medium">
                      {profile?.email.split("@")[0] ||
                        user?.email.split("@")[0]}
                    </h2>
                    <p className="text-gray-400">
                      {profile?.email || user?.email}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-emerald-900/40 text-emerald-400 text-xs rounded-full border border-emerald-800/50">
                        User ID: {profile?.id || user?.id}
                      </span>
                      {profile?.is_active && (
                        <span className="px-2 py-1 bg-blue-900/40 text-blue-400 text-xs rounded-full border border-blue-800/50">
                          Active Account
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/20 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-medium mb-3 text-emerald-400">
                      Account Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p>{profile?.email || user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">User ID</p>
                        <p>{profile?.id || user?.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Account Status</p>
                        <p
                          className={
                            profile?.is_active
                              ? "text-emerald-400"
                              : "text-red-400"
                          }
                        >
                          {profile?.is_active ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-medium mb-3 text-emerald-400">
                      API Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">API Endpoint</p>
                        <p>
                          {process.env.NEXT_PUBLIC_API_URL ||
                            "http://127.0.0.1:8000"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Authentication</p>
                        <p>JWT Bearer Token</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Status</p>
                        <p className="text-emerald-400">Connected</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
