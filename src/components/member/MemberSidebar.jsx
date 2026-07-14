import { NavLink } from "react-router-dom";
import { RefreshCw, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/reset-password", label: "Reset password", icon: RefreshCw },
];

function MemberSidebar() {
  return (
    <aside className="w-full">
      <nav className="flex items-center gap-6 overflow-x-auto md:gap-8">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex shrink-0 items-center gap-2 py-1 text-base font-medium transition-colors",
                isActive
                  ? "text-brown-600"
                  : "text-brown-400 hover:text-brown-600"
              )
            }
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default MemberSidebar;
