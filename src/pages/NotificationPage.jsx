import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserRound, Heart, MessageSquare, Sparkles, CheckCheck } from "lucide-react";
import MemberPageLayout from "@/components/member/MemberPageLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuth";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/api/blogApi";

function NotificationPage() {
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetchNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    loadNotifications();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleNotificationClick = async (item) => {
    if (!item.isRead && typeof item.id === "number") {
      try {
        await markNotificationAsRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        );
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="size-4 text-red-500 fill-red-500" />;
      case "comment":
        return <MessageSquare className="size-4 text-blue-500" />;
      default:
        return <Sparkles className="size-4 text-amber-500" />;
    }
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <MemberPageLayout title="Notifications">
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-brown-600">Recent Notifications</h2>

        <div className="divide-y divide-border rounded-xl border border-border bg-white shadow-xs">
          {isLoading ? (
            <p className="p-6 text-center text-muted-foreground">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground">No recent notifications found.</p>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.title}
                        className="size-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <span className="inline-flex size-10 items-center justify-center rounded-full bg-muted shrink-0">
                        <UserRound className="size-5 text-muted-foreground" />
                      </span>
                    )}
                    <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-white shadow-xs border border-border">
                      {renderIcon(item.type)}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <p className="text-sm text-brown-600">
                      <span className="font-semibold">{item.title}</span> {item.message}
                    </p>
                    <span className="text-xs text-muted-foreground mt-1">{item.time}</span>
                  </div>
                </div>

                {item.postId && (
                  <Button
                    asChild
                    variant="outline"
                    className="h-9 self-start sm:self-center rounded-full border-border bg-white px-5 text-xs font-medium text-brown-600 hover:bg-muted"
                  >
                    <Link to={`/post/${item.postId}`}>View Article</Link>
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </MemberPageLayout>
  );
}

export default NotificationPage;
