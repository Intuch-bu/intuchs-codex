import { Link } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-140px)] max-w-[1366px] flex-col items-center justify-center gap-6 px-10 py-16">
        <CircleAlert className="size-16 stroke-1 text-foreground" />
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <Button asChild size="lg" className="h-12 rounded-full px-8">
          <Link to="/">Go To Homepage</Link>
        </Button>
      </main>
      <Footer />
    </>
  );
}

export default NotFoundPage;
