import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { UserRound } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthorCard from "@/components/blog/AuthorCard";
import LoginRequiredDialog from "@/components/blog/LoginRequiredDialog";
import PostActions from "@/components/blog/PostActions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/useAuth";
import { formatDate } from "@/lib/formatDate";
import { MOCK_COMMENTS } from "@/constants/site";
import { fetchPostById } from "@/api/blogApi";

function ViewPostPage() {
  const { isLoggedIn } = useAuth();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchPostById(id);
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Post not found.");
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const content = post?.content ?? "";

  const requireAuth = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return false;
    }
    return true;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Copied!", {
        description: "This article has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShare = (platform) => {
    const link = encodeURIComponent(window.location.href);
    const shareUrls = {
      facebook: `https://www.facebook.com/share.php?u=${link}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`,
      twitter: `https://www.twitter.com/share?&url=${link}`,
    };

    window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1366px] px-4 py-8 sm:px-6 md:px-10 md:py-10">
        {isLoading ? (
          <p className="text-muted-foreground">Loading post...</p>
        ) : error ? (
          <p className="text-muted-foreground">{error}</p>
        ) : (
          <article className="flex flex-col gap-8 md:gap-10">
            <img
              className="h-[212px] w-full rounded-2xl object-cover sm:h-[400px] lg:h-[587px]"
              src={post.image}
              alt={post.title}
            />

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
              <div className="flex flex-1 flex-col gap-8">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3 md:gap-4">
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">
                      {post.category}
                    </span>
                    <span className="text-base font-medium text-brown-400">
                      {formatDate(post.date)}
                    </span>
                  </div>

                  <h1 className="mb-4 text-2xl font-semibold leading-8 text-brown-600 md:text-[40px] md:leading-[48px]">
                    {post.title}
                  </h1>
                  <p className="text-base font-medium leading-6 text-brown-400">
                    {post.description}
                  </p>
                </div>

                <div className="markdown">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>

                <div className="lg:hidden">
                  <AuthorCard author={post.author} />
                </div>

                <PostActions
                  likes={post.likes}
                  onRequireAuth={requireAuth}
                  onCopyLink={handleCopyLink}
                  onShare={handleShare}
                />

                <section className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold text-brown-600">Comment</h2>
                  <div className="rounded-2xl border border-border bg-white p-4">
                    <textarea
                      rows={4}
                      placeholder="What are your thoughts?"
                      onFocus={() => requireAuth()}
                      readOnly={!isLoggedIn}
                      className="w-full resize-none border-0 bg-transparent text-base font-medium text-brown-600 outline-none placeholder:text-brown-400"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        className="h-10 rounded-full bg-brown-600 px-8 text-base font-medium text-white hover:bg-brown-600/90"
                        onClick={() => requireAuth()}
                      >
                        Send
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    {MOCK_COMMENTS.map((comment, index) => (
                      <div
                        key={comment.id}
                        className={`flex gap-3 py-6 sm:gap-4 ${index < MOCK_COMMENTS.length - 1 ? "border-b border-border" : ""}`}
                      >
                        {comment.avatar ? (
                          <img
                            src={comment.avatar}
                            alt={comment.name}
                            className="size-11 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
                            <UserRound className="size-5 text-muted-foreground" />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                            <p className="text-xl font-semibold text-brown-600 sm:text-base">
                              {comment.name}
                            </p>
                            <p className="text-xs font-medium text-brown-400 sm:text-sm">
                              {comment.date}
                            </p>
                          </div>
                          <p className="text-base font-medium leading-6 text-brown-500">
                            {comment.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="hidden lg:block">
                <AuthorCard author={post.author} />
              </div>
            </div>
          </article>
        )}
      </main>
      <Footer />

      <LoginRequiredDialog
        isOpen={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />
    </>
  );
}

export default ViewPostPage;
