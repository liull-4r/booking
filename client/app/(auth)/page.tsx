"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "../../lib/auth";

export default function Home() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [dashboardHref, setDashboardHref] = useState("/login");

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      const role = getRole();
      setAuthenticated(isAuth);
      setDashboardHref(
        isAuth ? (role === "admin" ? "/admin" : "/dashboard") : "/login"
      );
    };

    checkAuth();
  }, []);

  const handleStartBooking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(dashboardHref);
  };

  return (
    <main className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Book Your Perfect
          <span className="text-indigo-600 dark:text-indigo-400"> Stay</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Discover amazing rooms and book your next adventure with ease. Simple,
          fast, and reliable booking system.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href={dashboardHref}
            onClick={handleStartBooking}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl text-lg font-semibold cursor-pointer"
          >
            Start Booking Now
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-xl border-2 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all text-lg font-semibold cursor-pointer"
          >
            Learn More
          </Link>
        </div>

        <div id="features" className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Easy Search
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Find the perfect room with our intuitive search and filter system
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Instant Booking
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Book your room instantly with real-time availability updates
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Secure & Safe
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your data and bookings are protected with enterprise-grade
              security
            </p>
          </div>
        </div>

        <div className="mt-20 md:mt-32 p-6 md:p-12 bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl text-white shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90">
            Join thousands of satisfied customers booking their perfect stays
          </p>
          <Link
            href={authenticated ? dashboardHref : "/login"}
            onClick={authenticated ? handleStartBooking : undefined}
            className="inline-block px-6 md:px-8 py-3 md:py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-base md:text-lg shadow-lg cursor-pointer"
          >
            {authenticated ? "Go to Dashboard" : "Create Account"}
          </Link>
        </div>
      </div>
    </main>
  );
}
