import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, UserRound, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SiteLogo from "@/components/layout/SiteLogo";
import { useAuth } from "@/context/useAuth";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/api/blogApi";

function UserAvatar({ user, className = "size-8" }) {
  if (user?.profileImage || user?.profile_pic) {
    return (
      <img
        src={user.profileImage || user.profile_pic}
        alt={user.name || "User"}
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${className} inline-flex items-center justify-center rounded-full bg-muted`}
    >
      <UserRound className="size-4 text-muted-foreground" />
    </span>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      const res = await fetchNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || (res.data || []).filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleNotificationClick = async (item) => {
    if (!item.isRead && typeof item.id === "number") {
      try {
        await markNotificationAsRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
    navigate(item.postId ? `/post/${item.postId}` : "/notifications");
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full border-b border-border bg-background">
      <div className="mx-auto max-w-[1366px] px-6 py-4 md:px-10">
        <div className="flex items-center justify-between">
          <SiteLogo />

          {isLoggedIn ? (
            <div className="hidden items-center gap-3 md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="relative inline-flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-muted"
                  aria-label="Notifications"
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-xs">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-2">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">Notifications</p>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-brown-600 hover:underline flex items-center gap-1"
                        >
                          <CheckCheck className="size-3" /> Read all
                        </button>
                      )}
                    </div>
                    <Link to="/notifications" className="text-xs font-medium text-brown-600 hover:underline">
                      View all
                    </Link>
                  </div>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-xs text-muted-foreground">No recent notifications</p>
                  ) : (
                    notifications.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className={`flex gap-3 rounded-xl px-2 py-3 hover:bg-muted cursor-pointer transition-colors ${
                          !item.isRead ? "bg-brand-soft/30 font-medium" : ""
                        }`}
                        onClick={() => handleNotificationClick(item)}
                      >
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.title}
                            className="size-9 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <span className="inline-flex size-9 items-center justify-center rounded-full bg-muted shrink-0">
                            <UserRound className="size-4 text-muted-foreground" />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-brown-600 leading-snug">
                            <span className="font-semibold">{item.title}</span>{" "}
                            <span className="text-brown-400">{item.message}</span>
                          </p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">{item.time}</span>
                            {!item.isRead && (
                              <span className="size-2 rounded-full bg-destructive inline-block" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 hover:bg-muted">
                  <UserAvatar user={user} />
                  <span className="text-sm font-medium">{user.name || user.username || user.email}</span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {user?.role === "admin" && (
                    <DropdownMenuItem onClick={() => navigate("/admin/articles")}>
                      Admin Management
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/notifications")}>
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/reset-password")}>
                    Reset password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden gap-2 md:flex">
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-brown-400 bg-white px-10 text-base font-medium text-brown-600 hover:bg-muted"
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="h-12 rounded-full bg-brown-600 px-10 text-base font-medium text-white hover:bg-brown-600/90"
              >
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              className="cursor-pointer p-1 md:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={16}
              alignOffset={40}
              className="box-border w-screen min-w-0 rounded-none border bg-white p-0 shadow-sm ring-0 md:hidden"
            >
              <div className="mx-auto flex w-full max-w-[1366px] flex-col gap-3 px-6 py-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 pb-2">
                      <UserAvatar user={user} className="size-10" />
                      <span className="font-medium">{user.name || user.username || user.email}</span>
                    </div>
                    {user?.role === "admin" && (
                      <Button asChild variant="outline" className="h-12 w-full rounded-full">
                        <Link to="/admin/articles">Admin Management</Link>
                      </Button>
                    )}
                    <Button asChild variant="outline" className="h-12 w-full rounded-full">
                      <Link to="/profile">Profile</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 w-full rounded-full">
                      <Link to="/notifications">Notifications</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 w-full rounded-full">
                      <Link to="/reset-password">Reset password</Link>
                    </Button>
                    <Button
                      type="button"
                      className="h-12 w-full rounded-full"
                      onClick={handleLogout}
                    >
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="h-12 w-full rounded-full">
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button asChild className="h-12 w-full rounded-full">
                      <Link to="/signup">Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
