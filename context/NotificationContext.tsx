"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export interface Notification {
  title: string;
  content: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: { title: string; content: string }) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from Supabase on mount
  useEffect(() => {
    async function fetchNotifications() {
      const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
      if (!error && data) setNotifications(data);
    }
    fetchNotifications();
  }, []);

  // Add notification to Supabase and update state
  const addNotification = async (notification: { title: string; content: string }) => {
    const { data, error } = await supabase.from("notifications").insert({
      title: notification.title,
      content: notification.content,
      read: false,
      created_at: new Date().toISOString(),
    }).select().single();
    if (!error && data) setNotifications((prev) => [data, ...prev]);
  };

  // Mark all as read in Supabase and update state
  const markAllAsRead = async () => {
    await supabase.from("notifications").update({ read: true }).eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within a NotificationProvider");
  return context;
}

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const { notifications, markAllAsRead } = useNotification();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav>
      {/* Other navbar code */}
      {isLoggedIn && (
        <div className="relative">
          <button
            onClick={() => {
              // When opening your notifications dropdown, mark them all as read:
              markAllAsRead();
            }}
            className="relative flex items-center justify-center h-8 w-8 rounded-full bg-steel-dark text-white hover:bg-steel-gray"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
            )}
          </button>
          {/* Render your dropdown content here */}
        </div>
      )}
    </nav>
  );
}