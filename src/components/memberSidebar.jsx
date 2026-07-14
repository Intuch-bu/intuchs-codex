import { NavLink } from "react-router-dom";
import { KeyRound, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/reset-password", label: "Reset password", icon: KeyRound },
];

function MemberSidebar() {
  return (
    <aside className="w-full shrink-0 md:w-56">
      <nav className="flex gap-2 md:flex-col">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default MemberSidebar;
