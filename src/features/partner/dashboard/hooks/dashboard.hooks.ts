import { useQuery } from "@tanstack/react-query";
import { fetchPartnerDashboard } from "../api/dashboard.api";

export const PARTNER_DASHBOARD_KEY = ["partner-dashboard"] as const;

export function usePartnerDashboard() {
  return useQuery({
    queryKey: PARTNER_DASHBOARD_KEY,
    queryFn: fetchPartnerDashboard,
    staleTime: 2 * 60 * 1000,
  });
}