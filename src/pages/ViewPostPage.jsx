import { useEffect, useState, useCallback } from "react";
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
import {
  fetchPostById,
  fetchComments,
  addComment,
  fetchLikeStatus,
  toggleLike,
} from "@/api/blogApi";

function ViewPostPage() {
  const { isLoggedIn } = useAuth();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const loadComments = useCallback(async () => {
    try {
      const res = await fetchComments(id);
      setComments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  }, [id]);

  const loadLikeStatus = useCallback(async () => {
    try {
      const res = await fetchLikeStatus(id);
      setLikesCount(res.likes_count ?? 0);
      setIsLiked(!!res.isLiked);
    } catch (err) {
      console.error("Failed to fetch like status:", err);
    }
  }, [id]);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchPostById(id);
        const postData = response.data || response;
        setPost(postData);
        setLikesCount(postData.likes_count ?? postData.likes ?? 0);

        await Promise.all([loadComments(), loadLikeStatus()]);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Post not found.");
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id, loadComments, loadLikeStatus]);

  const content = (post?.content ?? "").replace(/\\n/g, "\n");

  const requireAuth = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return false;
    }
    return true;
  };

  const handleToggleLike = async () => {
    if (!requireAuth()) return;
    try {
      const res = await toggleLike(id);
      setLikesCount(res.likes_count ?? 0);
      setIsLiked(!!res.isLiked);
    } catch (err) {
      console.error("Failed to toggle like:", err);
      toast.error("Failed to update like status");
    }
  };

  const handleSendComment = async () => {
    if (!requireAuth()) return;
    const trimmed = commentInput.trim();
    if (!trimmed) return;

    setIsSubmittingComment(true);
    try {
      await addComment(id, trimmed);
      setCommentInput("");
      await loadComments();
      toast.success("Comment posted!");
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error(err.response?.data?.message || "Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Copied!", {
        description: "This article link has been copied to your clipboard.",
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
                  <AuthorCard
                    author={post.author}
                    author_name={post.author_name}
                    author_avatar={post.author_avatar}
                    author_bio={post.author_bio}
                  />
                </div>

                <PostActions
                  likesCount={likesCount}
                  isLiked={isLiked}
                  onToggleLike={handleToggleLike}
                  onRequireAuth={requireAuth}
                  onCopyLink={handleCopyLink}
                  onShare={handleShare}
                />

                <section className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold text-brown-600">Comment</h2>
                  <div className="rounded-2xl border border-border bg-white p-4">
                    <textarea
                      rows={4}
                      placeholder={isLoggedIn ? "What are your thoughts?" : "Log in to post a comment..."}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onFocus={() => requireAuth()}
                      readOnly={!isLoggedIn}
                      className="w-full resize-none border-0 bg-transparent text-base font-medium text-brown-600 outline-none placeholder:text-brown-400"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        disabled={isSubmittingComment || !commentInput.trim()}
                        className="h-10 rounded-full bg-brown-600 px-8 text-base font-medium text-white hover:bg-brown-600/90 disabled:opacity-50"
                        onClick={handleSendComment}
                      >
                        {isSubmittingComment ? "Posting..." : "Send"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    {comments.length === 0 ? (
                      <p className="py-6 text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
                    ) : (
                      comments.map((comment, index) => (
                        <div
                          key={comment.id}
                          className={`flex gap-3 py-6 sm:gap-4 ${index < comments.length - 1 ? "border-b border-border" : ""}`}
                        >
                          {comment.profile_pic ? (
                            <img
                              src={comment.profile_pic}
                              alt={comment.name || comment.username}
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
                                {comment.name || comment.username || "User"}
                              </p>
                              <p className="text-xs font-medium text-brown-400 sm:text-sm">
                                {formatDate(comment.created_at)}
                              </p>
                            </div>
                            <p className="text-base font-medium leading-6 text-brown-500">
                              {comment.comment_text}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              <div className="hidden lg:block">
                <AuthorCard
                  author={post.author}
                  author_name={post.author_name}
                  author_avatar={post.author_avatar}
                  author_bio={post.author_bio}
                />
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
