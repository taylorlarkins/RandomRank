import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../supabaseClient";
import { Navigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [status, setStatus] = useState<"loading" | "unauthenticated" | "needsRanking" | "home">("loading");
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setStatus("unauthenticated");
        return;
      }

      const today = new Date().toISOString().slice(0, 10);

      const { data: ranking } = await supabase
        .from("user_rankings")
        .select("id")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      if (!ranking) {
        setStatus("needsRanking");
      } else {
        setStatus("home");
      }
    }

    checkAuth();
  }, []);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading…</div>;
  }

  if (status === "unauthenticated") {
    // Only allow login/signup pages
    if (location.pathname === "/login" || location.pathname === "/signup") {
      return <>{children}</>;
    }
    return <Navigate to="/login" replace />;
  }

  if (status === "needsRanking") {
    // Only allow ranking page
    if (location.pathname === "/rank") {
      return <>{children}</>;
    }
    return <Navigate to="/rank" replace />;
  }

  if (status === "home") {
    // User has ranked, prevent access to /rank
    if (location.pathname === "/rank") {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  return null;
};
