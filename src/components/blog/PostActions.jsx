import { Hand, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function PostActions({ likesCount = 0, isLiked = false, onToggleLike, onRequireAuth, onCopyLink, onShare }) {
  const handleLikeClick = () => {
    if (!onRequireAuth()) return;
    if (onToggleLike) {
      onToggleLike();
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-muted px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <button
        type="button"
        onClick={handleLikeClick}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-base font-medium transition-colors sm:w-fit ${
          isLiked
            ? "border-brown-600 bg-brown-600 text-white hover:bg-brown-600/90"
            : "border-border bg-white text-brown-600 hover:bg-background"
        }`}
      >
        <Hand className={`size-5 ${isLiked ? "fill-white" : ""}`} />
        {likesCount}
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-full border-border bg-white px-5 text-base font-medium text-brown-600"
          onClick={onCopyLink}
        >
          <Link2 className="size-4" />
          Copy link
        </Button>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full bg-[#1877F2] text-sm font-semibold text-white"
          onClick={() => onShare("facebook")}
          aria-label="Share on Facebook"
        >
          f
        </button>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full bg-[#0A66C2] text-xs font-semibold text-white"
          onClick={() => onShare("linkedin")}
          aria-label="Share on LinkedIn"
        >
          in
        </button>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full bg-[#1DA1F2] text-sm font-semibold text-white"
          onClick={() => onShare("twitter")}
          aria-label="Share on Twitter"
        >
          X
        </button>
      </div>
    </div>
  );
}

export default PostActions;
