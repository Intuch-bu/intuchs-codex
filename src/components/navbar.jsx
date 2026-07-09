import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200">
      <div className="mx-auto max-w-[1366px] px-10 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Intuch<span className="text-teal-500">'</span>s Codex
          </Link>

          <div className="hidden gap-4 md:flex">
            <Button asChild variant="outline">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild variant="default">
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>

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
                <Button asChild variant="outline" className="h-12 w-full rounded-full">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild variant="default" className="h-12 w-full rounded-full">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
