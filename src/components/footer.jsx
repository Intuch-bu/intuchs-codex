import { CircleUserRound } from "lucide-react";
import { GitFork } from 'lucide-react';
import { Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200">
      <div className="mx-auto flex max-w-[1366px] flex-col items-center justify-between gap-4 px-10 py-4 md:flex-row md:gap-0">
        <div className="flex items-center gap-2">
          <p>Get in touch</p>
          <a href="linkedin.com"><CircleUserRound /></a>
          <a href="github.com"><GitFork /></a>
          <a href="gmail.com"><Mail /></a>
        </div>
        <a href="index.html">Home Page</a>
      </div>
    </footer>
  );
}
