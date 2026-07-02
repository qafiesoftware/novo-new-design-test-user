import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getUserBalanceData, getUserData } from "../api/dashboard.api";
import { useEffect } from "react";

export function useDashboardStats() {
  const query = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  return {
    ...query,
    user: query.data?.data?.response, // ← DashboardUser
    status: query.data?.data?.status, // ← number
    result: query.data?.data?.result, // ← string
  };
}

// USER-DATA
export function useUserData() {
  const query = useQuery({
    queryKey: ["crm", "user"],
    queryFn: getUserData,
  });

  return {
    ...query,
    user: query.data?.data?.response,
    status: query.data?.data?.status,
  };
}

// export function useUserBalanceData() {
//   const query = useQuery({
//     queryKey: ["userBalance", "userData"],
//     queryFn: getUserBalanceData,
//   });

//   return {
//     ...query,
//     user: query.data?.data?.response,
//     status: query.data?.data?.status,
//   };
// }

export function useUserBalanceData() {
  const query = useQuery({
    queryKey: ["userBalance", "userData"],
    queryFn: getUserBalanceData,
  });

  const isIB = query.data?.data?.response?.user_activated_for_ib;

  useEffect(() => {
    if (isIB !== undefined) {
      document.cookie = `user_is_ib=${isIB}; path=/; SameSite=Lax`;
    }
  }, [isIB]);

  return {
    ...query,
    user: query.data?.data?.response,
    status: query.data?.data?.status,
  };
}
