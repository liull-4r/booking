"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isAuthenticated, getRole } from "../../lib/auth";

export default function Header() {
  const [authenticated, setAuthenticated] = useState(false);
  const [dashboardHref, setDashboardHref] = useState("/dashboard");

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      const role = getRole();
      setAuthenticated(isAuth);
      setDashboardHref(role === "admin" ? "/admin" : "/dashboard");
    };

    checkAuth();
  }, []);

  return (
    <nav className="container mx-auto px-4 py-4 md:py-6">
      <div className="flex items-center justify-between">
        <Link
          href={authenticated ? dashboardHref : "/"}
          className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
        >
          🏨 BookStay
        </Link>
        <div className="flex gap-2 md:gap-4">
          {authenticated ? (
            <Link
              href={dashboardHref}
              className="px-4 md:px-6 py-2 text-sm md:text-base bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 md:px-4 py-2 text-sm md:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-4 md:px-6 py-2 text-sm md:text-base bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
