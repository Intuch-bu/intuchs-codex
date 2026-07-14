import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, Search, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const notifications = [
  {
    id: 1,
    title: "Thompson P.",
    message: "Published a new article",
    time: "2 hours ago",
    avatar:
      "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg",
  },
  {
    id: 2,
    title: "Jacob Josh",
    message: "Commented on the article 'Will the deep dark forest...'",
    time: "4 hours ago",
    avatar: "",
  },
];

function UserAvatar({ user, className = "size-8" }) {
  if (user?.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.name}
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-background">
      <div className="mx-auto max-w-[1366px] px-10 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Intuch<span className="text-teal-500">'</span>s Codex
          </Link>

          {isLoggedIn ? (
            <div className="hidden items-center gap-3 md:flex">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Search"
                onClick={() => navigate("/#latest-articles")}
              >
                <Search className="size-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-muted"
                  aria-label="Notifications"
                >
                  <Bell className="size-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-2">
                  <p className="px-2 py-1.5 text-sm font-semibold">Notifications</p>
                  <DropdownMenuSeparator />
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-xl px-2 py-3 hover:bg-muted"
                    >
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.title}
                          className="size-9 rounded-full object-cover"
                        />
                      ) : (
                        <span className="inline-flex size-9 items-center justify-center rounded-full bg-muted">
                          <UserRound className="size-4 text-muted-foreground" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{item.title}</span>{" "}
                          <span className="text-muted-foreground">{item.message}</span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 hover:bg-muted">
                  <UserAvatar user={user} />
                  <span className="text-sm font-medium">{user.name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
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
            <div className="hidden gap-4 md:flex">
              <Button asChild variant="outline">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild variant="default">
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
              <div className="mx-auto flex w-full max-w-[1366px] flex-col gap-3 px-10 py-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 pb-2">
                      <UserAvatar user={user} className="size-10" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <Button asChild variant="outline" className="h-12 w-full rounded-full">
                      <Link to="/profile">Profile</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 w-full rounded-full">
                      <Link to="/reset-password">Reset password</Link>
                    </Button>
                    <Button
                      type="button"
                      variant="default"
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
                    <Button asChild variant="default" className="h-12 w-full rounded-full">
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
