import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api/sign-out.api";

const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 min

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(0);

  const handleLogout = useCallback(async () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.2s";

    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      document.cookie = "auth_token=; path=/; max-age=0; SameSite=Strict; Secure";
      document.cookie = "userToken=; path=/; max-age=0; SameSite=Strict; Secure";

      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("logout-event", Date.now().toString());

      document.body.style.opacity = "1";
      router.replace("/sign-in");
    }
  }, [router, queryClient]);

  // Inactivity timer reset
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_LIMIT);
  }, [handleLogout]);

  // Activity throttle — 1 sec
  const saveLastActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastSavedRef.current > 1000) {
      localStorage.setItem("lastActivity", now.toString());
      lastSavedRef.current = now;
    }
    resetTimer();
  }, [resetTimer]);

  // Activity listeners + inactivity check on mount
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, saveLastActivity));

    // Browser reopen check
    const lastActivity = localStorage.getItem("lastActivity");
    if (lastActivity && Date.now() - Number(lastActivity) > INACTIVITY_LIMIT) {
      handleLogout();
    }

    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, saveLastActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [saveLastActivity, handleLogout, resetTimer]);

  // Cross tab logout sync
  useEffect(() => {
    const syncLogout = (e: StorageEvent) => {
      if (e.key === "logout-event") {
        queryClient.clear();
        router.replace("/sign-in");
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, [router, queryClient]);

  return { handleLogout };
}