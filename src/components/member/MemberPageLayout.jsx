import { UserRound } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MemberSidebar from "@/components/member/MemberSidebar";
import { useAuth } from "@/context/useAuth";

function MemberPageLayout({ title, action, children }) {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-78px)] bg-background px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="flex flex-col md:grid md:grid-cols-[240px_1fr] md:gap-8">
            <div className="mb-6 md:mb-0">
              <MemberSidebar />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-6 flex items-center justify-between gap-4 md:mb-8">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted md:size-12">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user?.name || "Admin"}
                        className="size-full object-cover"
                      />
                    ) : (
                      <UserRound className="size-5 text-muted-foreground md:size-6" />
                    )}
                  </div>
                  <p className="max-w-[120px] truncate text-base font-medium text-brown-600 md:max-w-none">
                    {user?.name || "Admin"}
                  </p>
                  <span className="h-5 w-px shrink-0 bg-border md:h-6" />
                  <h1 className="text-xl font-semibold text-brown-600 md:text-2xl">
                    {title}
                  </h1>
                </div>
                {action && <div>{action}</div>}
              </div>

              <section className="rounded-2xl border border-border bg-white p-6 shadow-xs md:p-8">
                {children}
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default MemberPageLayout;
