import { useEffect, useState } from "react";
import CategorySelector from "@/components/blog/CategorySelector";
import BlogCard from "@/components/blog/BlogCard";
import { formatDate } from "@/lib/formatDate";
import { fetchPosts } from "@/api/blogApi";
import {
  BLOG_CATEGORIES,
  DEFAULT_CATEGORY,
  POSTS_PER_PAGE,
} from "@/constants/blog";

function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadPosts = async () => {
      setIsRefetching(true);

      try {
        const data = await fetchPosts({
          category: selectedCategory,
          page: 1,
          limit: POSTS_PER_PAGE,
        });

        if (isCancelled) return;

        setPosts(data.posts ?? []);
        setNextPage(data.nextPage ?? null);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        if (isCancelled) return;
        setPosts([]);
        setNextPage(null);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
          setIsRefetching(false);
        }
      }
    };

    loadPosts();

    return () => {
      isCancelled = true;
    };
  }, [selectedCategory]);

  const handleViewMore = async () => {
    if (!nextPage || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const data = await fetchPosts({
        category: selectedCategory,
        page: nextPage,
        limit: POSTS_PER_PAGE,
      });
      setPosts((prevPosts) => [...prevPosts, ...(data.posts ?? [])]);
      setNextPage(data.nextPage ?? null);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const showInitialLoading = isLoading && posts.length === 0;
  const showViewMore =
    !showInitialLoading && !isRefetching && posts.length > 0 && nextPage != null;

  return (
    <section id="latest-articles" className="w-full bg-background pb-16 md:pb-[120px]">
      <div className="mx-auto flex max-w-[1366px] flex-col gap-8 px-4 sm:px-6 md:gap-12 md:px-10">
        <div className="flex flex-col gap-6 md:gap-8">
          <h2 className="text-2xl font-semibold text-brown-600">Latest articles</h2>
          <CategorySelector
            categories={BLOG_CATEGORIES}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {showInitialLoading ? (
          <p className="text-muted-foreground">Loading articles...</p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground">No articles found.</p>
        ) : (
          <>
            <div
              className={`grid grid-cols-1 gap-x-5 gap-y-12 transition-opacity md:grid-cols-2 ${
                isRefetching ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  {...post}
                  date={formatDate(post.date)}
                />
              ))}
            </div>

            {showViewMore && (
              <div className="flex justify-center">
                <button
                  type="button"
                  disabled={isLoadingMore}
                  onClick={handleViewMore}
                  className="text-base font-medium text-brown-600 underline underline-offset-4 disabled:opacity-60"
                >
                  {isLoadingMore ? "Loading..." : "View more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ArticleSection;
