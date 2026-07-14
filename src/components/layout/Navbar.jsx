import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, Search, UserRound } from "lucide-react";
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
import { NOTIFICATIONS } from "@/constants/site";

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
    <nav className="w-full border-b border-border bg-background">
      <div className="mx-auto max-w-[1366px] px-6 py-4 md:px-10">
        <div className="flex items-center justify-between">
          <SiteLogo />

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
                  {NOTIFICATIONS.map((item) => (
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
                  <ChevronDown className="size-4 text-muted-foreground" />
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
