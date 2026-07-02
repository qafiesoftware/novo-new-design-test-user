"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Bell, X } from "lucide-react";
import { useNotifications } from "@/features/notifications/hooks/notification.hooks";
import { Notification } from "@/features/notifications/types/notification.types";

// Time formatter

function formatTime(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  } catch {
    return dateStr;
  }
}

// Avatar — first letter of notification
function NotifAvatar({ text }: { text: string }) {
  const letter = text?.trim()?.[0]?.toUpperCase() ?? "N";
  const colors = [
    "bg-blue-400",
    "bg-indigo-400",
    "bg-violet-400",
    "bg-emerald-400",
    "bg-orange-400",
    "bg-cyan-400",
  ];
  const color = colors[letter.charCodeAt(0) % colors.length];

  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${color}`}
    >
      {letter}
    </span>
  );
}

// Drawer
function NotificationDrawer({
  open,
  onClose,
  notifications,
  markAsRead,
}: {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  markAsRead: (id: string | number | "all") => Promise<void>;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 z-[9999] flex h-full w-80 flex-col bg-white shadow-2xl sm:w-96 dark:bg-gray-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-indigo-600 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-white" />
                <h2 className="text-base font-semibold text-white">Notifications</h2>
              </div>
              <button onClick={onClose} className="text-white/80 transition hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mark all */}
            <div className="flex justify-end border-b border-gray-100 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
              <button
                onClick={() => markAsRead("all")}
                className="flex items-center gap-1 text-xs font-medium text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Check className="h-3.5 w-3.5" /> Mark all as read
              </button>
            </div>

            {/* List */}
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {notifications.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  No notifications available
                </p>
              ) : (
                notifications.map((item) => {
                  const isNew = item.read_status === "0" || item.read_status === 0;
                  return (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`relative cursor-pointer rounded-xl border p-3 shadow-sm transition hover:shadow-md ${
                        isNew
                          ? "border-blue-100 bg-blue-50 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30"
                          : "border-gray-100 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <NotifAvatar text={item.notification} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] leading-snug text-gray-800 dark:text-gray-200">
                            {item.notification}
                          </p>
                          <p className="mt-1.5 text-[11px] text-gray-400">
                            {formatTime(item.date)}
                          </p>
                        </div>
                      </div>
                      {isNew && (
                        <span className="absolute -top-0.5 right-2 animate-pulse rounded-full bg-emerald-300 px-2 py-px text-[9px] font-semibold text-green-800">
                          NEW
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Main Dropdown
export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markAsRead } = useNotifications(15000);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayed = notifications.slice(0, 3);

  return (
    <>
      <div className="relative" ref={ref}>
        {/* Bell button */}
        <button
          onClick={() => setIsOpen((p) => !p)}
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          aria-label="Notifications"
        >
          {/* Unread dot */}
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 z-10 flex h-2 w-2 rounded-full bg-orange-400">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
            </span>
          )}
          <svg
            className="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="fixed left-1/2 top-16 z-50 mt-1 flex w-[calc(100vw-32px)] max-w-[361px] -translate-x-1/2 flex-col rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-[17px] sm:w-[361px] sm:-translate-x-0"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <h5 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    Notifications
                  </h5>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => markAsRead("all")}
                  className="flex items-center gap-1 text-xs font-medium text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <Check className="h-3.5 w-3.5" /> Mark all read
                </button>
              </div>

              {/* Notification list */}
              <ul className="max-h-[340px] space-y-1 overflow-y-auto p-2">
                {displayed.length === 0 ? (
                  <li className="py-10 text-center text-sm text-gray-400">No new notifications</li>
                ) : (
                  displayed.map((item) => {
                    const isNew = item.read_status === "0" || item.read_status === 0;
                    return (
                      <li key={item.id}>
                        <div
                          onClick={() => {
                            markAsRead(item.id);
                            setIsOpen(false);
                          }}
                          className={`relative flex cursor-pointer items-start gap-3 rounded-xl p-3 transition ${
                            isNew
                              ? "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/30"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <NotifAvatar text={item.notification} />
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] leading-snug text-gray-800 dark:text-gray-200">
                              {item.notification}
                            </p>
                            <p className="mt-1 text-[11px] text-gray-400">
                              {formatTime(item.date)}
                            </p>
                          </div>
                          {isNew && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                          )}
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>

              {/* Footer */}
              <div className="border-t border-gray-100 p-3 dark:border-gray-700">
                {notifications.length > 3 && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setDrawerOpen(true);
                    }}
                    className="mb-2 w-full rounded-lg py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                  >
                    View all {notifications.length} notifications →
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drawer — all notifications */}
      <NotificationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notifications={notifications}
        markAsRead={markAsRead}
      />
    </>
  );
}
