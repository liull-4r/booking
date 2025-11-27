"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "../../lib/auth";
import Spinner from "./Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | "user";
}

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const userRole = getRole();

    if (role && userRole !== role) {
      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [router, role]);

  if (isLoading) {
    return (
      <div className="h-screen">
        <Spinner size="md" className="h-full" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
