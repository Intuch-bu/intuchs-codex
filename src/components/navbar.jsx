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
          <h1 className="text-2xl font-bold">Intuch's Codex</h1>

          <div className="hidden gap-4 md:flex">
            <Button variant="outline">Log in</Button>
            <Button variant="default">Register</Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="p-1 md:hidden"
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
                <Button variant="outline" className="h-12 w-full rounded-full">
                  Log in
                </Button>
                <Button variant="default" className="h-12 w-full rounded-full">
                  Register
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>  );
}

export default Navbar;
