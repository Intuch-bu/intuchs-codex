import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
      <nav className="w-full border-b border-gray-200">
        <div className="mx-auto flex max-w-[1366px] items-center justify-between px-10 py-4">
          <h1 className="text-2xl font-bold">Intuch's Codex</h1>
          <div className="flex gap-4">
            <Button variant="outline">Log in</Button>
            <Button variant="default">Register</Button>
          </div>
        </div>
      </nav>
    );
  }