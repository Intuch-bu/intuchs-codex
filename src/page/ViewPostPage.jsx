import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Hand, Link2, X } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/formatDate";
import { fetchPostById } from "@/services/blogApi";

const AUTHOR_AVATAR =
  "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg";

const AUTHOR_BIO =
  "I am a pet enthusiast and freelance writer who specializes in animal behavior and wellness. My goal is to inform and inspire others through my work.";

const isLoggedIn = false;

function ViewPostPage() {
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
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}`,
    };

    window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1366px] px-10 py-8">
        {isLoading ? (
          <p className="text-muted-foreground">Loading post...</p>
        ) : error ? (
          <p className="text-muted-foreground">{error}</p>
        ) : (
          <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <img
              className="h-[300px] w-full object-cover sm:h-[400px]"
              src={post.image}
              alt={post.title}
            />

            <div className="flex flex-col gap-8 p-6 sm:p-10 lg:flex-row">
              <div className="flex flex-1 flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-600">
                    {post.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post.date)}
                  </span>
                </div>

                <h1 className="text-3xl font-bold">{post.title}</h1>
                <p className="text-muted-foreground">{post.description}</p>

                <div className="markdown">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>

                <div className="flex flex-col gap-4 rounded-2xl bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => requireAuth()}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium"
                  >
                    <Hand className="size-4" />
                    {post.likes}
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={handleCopyLink}
                    >
                      <Link2 className="size-4" />
                      Copy
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-full text-sm font-semibold"
                      onClick={() => handleShare("facebook")}
                      aria-label="Share on Facebook"
                    >
                      f
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-full text-xs font-semibold"
                      onClick={() => handleShare("linkedin")}
                      aria-label="Share on LinkedIn"
                    >
                      in
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-full text-sm font-semibold"
                      onClick={() => handleShare("twitter")}
                      aria-label="Share on Twitter"
                    >
                      X
                    </Button>
                  </div>
                </div>

                <section className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold">Comment</h2>
                  <textarea
                    rows={4}
                    placeholder="What are your thoughts?"
                    onFocus={() => requireAuth()}
                    readOnly={!isLoggedIn}
                    className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      className="h-10 rounded-full px-6"
                      onClick={() => requireAuth()}
                    >
                      Send
                    </Button>
                  </div>
                </section>
              </div>

              <aside className="lg:w-[280px] lg:shrink-0">
                <div className="rounded-2xl bg-muted p-6">
                  <img
                    className="mb-4 h-11 w-11 rounded-full object-cover"
                    src={AUTHOR_AVATAR}
                    alt={post.author}
                  />
                  <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground">
                    AUTHOR
                  </p>
                  <p className="mb-3 font-bold">{post.author}</p>
                  <p className="text-sm text-muted-foreground">{AUTHOR_BIO}</p>
                </div>
              </aside>
            </div>
          </article>
        )}
      </main>
      <Footer />

      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogCancel aria-label="Close">
            <X className="size-4" />
          </AlertDialogCancel>
          <AlertDialogHeader>
            <AlertDialogTitle>Create an account to continue</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Create account</AlertDialogAction>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-foreground underline-offset-4 hover:underline"
                onClick={() => setShowLoginDialog(false)}
              >
                Log in
              </button>
            </p>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ViewPostPage;
