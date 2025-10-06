'use client';

import Link from "next/link";
import { ShieldCheck, User, LogOut, UserPlus, Bell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">
              Tourist Safety Portal
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Navigation Links for Authenticated Users */}
                {user.permissions.canRegisterTourists && (
                  <Link
                    href="/register"
                    className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md"
                  >
                    Register Tourist
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>

                {/* Create Agent Button - Only for Government Officials */}
                {user.permissions.canCreateAgents && (
                  <Link
                    href="/create-agent"
                    className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Create Agent</span>
                  </Link>
                )}

                {/* Send Notification Button - For users with notification permissions */}
                {user.permissions.canSendNotifications && (
                  <Link
                    href="/send-notification"
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Bell className="h-4 w-4" />
                    <span>Send Notification</span>
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md"
                  >
                    <User className="h-5 w-5" />
                    <span>{user.profile.fullName || user.username}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {user.role === 'government' ? 'Gov' : 'Agent'}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user.profile.fullName}</div>
                        <div className="text-gray-500">{user.email}</div>
                        <div className="text-xs text-blue-600">
                          {user.role === 'government' ? `ID: ${user.governmentId}` : `Agent: ${user.agentId}`}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  href="/admin-register"
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
