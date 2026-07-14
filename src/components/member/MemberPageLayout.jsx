import { UserRound } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MemberSidebar from "@/components/member/MemberSidebar";
import { useAuth } from "@/context/useAuth";

function MemberPageLayout({ title, children }) {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-78px)] bg-background px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[960px]">
          <div className="mb-6 md:mb-8">
            <MemberSidebar />
          </div>

          <div className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted md:size-12">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="size-full object-cover"
                />
              ) : (
                <UserRound className="size-5 text-muted-foreground md:size-6" />
              )}
            </div>
            <p className="max-w-[40%] truncate text-base font-medium text-brown-600 md:max-w-none">
              {user?.name}
            </p>
            <span className="h-5 w-px shrink-0 bg-border md:h-6" />
            <h1 className="text-xl font-semibold text-brown-600 md:text-2xl">
              {title}
            </h1>
          </div>

          <section className="rounded-2xl bg-muted p-6 md:p-10">{children}</section>
        </div>
      </main>
    </>
  );
}

export default MemberPageLayout;
