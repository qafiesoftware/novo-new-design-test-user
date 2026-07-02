import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { usePathname } from "next/navigation";
import { API_ENDPOINTS } from "@/constants/endpoints";
import type { Notification, UseNotificationsReturn } from "../types/notification.types";

const CRM_NOTIFICATION_KEY = ["notifications"] as const;
const PARTNER_NOTIFICATION_KEY = ["partnerNotifications"] as const;

// ── Fetch CRM
async function fetchNotifications(): Promise<Notification[]> {
  const res = await api.post<{ data: { response: Notification[] } }>(
    API_ENDPOINTS.USER_NOTIFICATION.GET_NOTIFICATION
  );
  return res.data?.data?.response ?? [];
}

// ── Fetch Partner
async function fetchPartnerNotifications(): Promise<Notification[]> {
  const res = await api.post<{ data: { response: Notification[] } }>(
    API_ENDPOINTS.PARTNER_DASHBOARD.GET_USER_PARTNER_NOTIFICATION
  );
  return res.data?.data?.response ?? [];
}

// ── Mark as read — common
async function markNotificationRead(notification_id: string | number | "all") {
  await api.post(API_ENDPOINTS.USER_NOTIFICATION.READ_NOTIFICATION, { notification_id });
}

// ── Hook
export function useNotifications(refetchInterval = 15000): UseNotificationsReturn {
  const queryClient = useQueryClient();
  const pathname = usePathname(); // current route

  const isPartner = pathname.startsWith("/partners"); // route based
  const NOTIFICATION_KEY = isPartner ? PARTNER_NOTIFICATION_KEY : CRM_NOTIFICATION_KEY;

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: NOTIFICATION_KEY,
    queryFn: isPartner ? fetchPartnerNotifications : fetchNotifications,
    refetchInterval,
    staleTime: 0,
  });

  const unreadCount = notifications.filter(
    (n) => n.read_status === "0" || n.read_status === 0
  ).length;

  const { mutateAsync: markAsRead } = useMutation({
    mutationFn: markNotificationRead, // common
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEY });
      const prev = queryClient.getQueryData<Notification[]>(NOTIFICATION_KEY) ?? [];

      queryClient.setQueryData<Notification[]>(NOTIFICATION_KEY, (old = []) =>
        old.map((n) => (id === "all" || n.id === id ? { ...n, read_status: "1" as const } : n))
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(NOTIFICATION_KEY, ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEY });
    },
  });

  return { notifications, unreadCount, isLoading, markAsRead };
}