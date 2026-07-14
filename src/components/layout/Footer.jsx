import { Link } from "react-router-dom";
import { GitFork, Mail, UserRound } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full bg-muted">
      <div className="mx-auto flex max-w-[1366px] flex-col items-center justify-between gap-6 px-4 py-10 text-center sm:px-6 md:flex-row md:px-10 md:py-[60px] md:text-left">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <p className="text-base font-medium text-brown-500">Get in touch</p>
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-brown-600 hover:opacity-70"
            >
              <UserRound className="size-6" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-brown-600 hover:opacity-70"
            >
              <GitFork className="size-6" />
            </a>
            <a
              href="mailto:hello@example.com"
              aria-label="Email"
              className="text-brown-600 hover:opacity-70"
            >
              <Mail className="size-6" />
            </a>
          </div>
        </div>

        <Link
          to="/"
          className="text-base font-medium text-brown-600 underline underline-offset-4"
        >
          Home page
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
