import { NavLink } from "react-router-dom";
import { Bell, FileText, FolderTree, RefreshCw, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/useAuth";

function MemberSidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const links = [
    ...(isAdmin
      ? [
          { to: "/admin/articles", label: "Article management", icon: FileText },
          { to: "/admin/categories", label: "Category management", icon: FolderTree },
        ]
      : []),
    { to: "/profile", label: "Profile", icon: UserRound },
    { to: "/notifications", label: "Notification", icon: Bell },
    { to: "/reset-password", label: "Reset password", icon: RefreshCw },
  ];

  return (
    <aside className="w-full">
      <nav className="flex items-center gap-4 overflow-x-auto border-b border-border pb-4 md:flex-col md:items-start md:gap-3 md:border-b-0 md:pb-0">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium transition-colors w-full",
                isActive
                  ? "bg-brown-100 text-brown-600 font-semibold"
                  : "text-brown-400 hover:bg-muted hover:text-brown-600"
              )
            }
          >
            <Icon className="size-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default MemberSidebar;
