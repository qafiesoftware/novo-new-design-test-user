export interface Notification {
  id: string | number;
  notification: string;
  read_status: "0" | "1" | 0 | 1;
  date: string;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string | number | "all") => Promise<void>;
}
