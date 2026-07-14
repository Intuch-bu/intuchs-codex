import { useEffect, useState } from "react";
import CategorySelector from "@/components/categorySelector";
import BlogCard from "@/components/blogCard";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatDate";
import { fetchPosts } from "@/services/blogApi";

const categories = ["Highlight", "Cat", "Inspiration", "General"];
const POSTS_PER_PAGE = 6;

function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = useState("Highlight");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      setIsRefetching(true);

      try {
        const data = await fetchPosts({
          category: selectedCategory,
          page: 1,
          limit: POSTS_PER_PAGE,
        });
        setPosts(data.posts ?? []);
        setCurrentPage(1);
        setTotalPages(data.totalPages ?? 1);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
        setCurrentPage(1);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
        setIsRefetching(false);
      }
    };

    loadPosts();
  }, [selectedCategory]);

  const handleViewMore = async () => {
    const nextPage = currentPage + 1;
    setIsLoadingMore(true);

    try {
      const data = await fetchPosts({
        category: selectedCategory,
        page: nextPage,
        limit: POSTS_PER_PAGE,
      });
      setPosts((prevPosts) => [...prevPosts, ...(data.posts ?? [])]);
      setCurrentPage(nextPage);
      setTotalPages(data.totalPages ?? totalPages);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const showInitialLoading = isLoading && posts.length === 0;
  const showViewMore =
    !showInitialLoading && !isRefetching && posts.length > 0 && currentPage < totalPages;

  return (
    <section id="latest-articles" className="w-full">
      <div className="mx-auto max-w-[1366px] px-10 py-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Latest articles</h2>

        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {showInitialLoading ? (
          <p className="text-muted-foreground">Loading articles...</p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground">No articles found.</p>
        ) : (
          <>
            <div
              className={`grid grid-cols-1 gap-4 transition-opacity md:grid-cols-2 ${
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
              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full px-8"
                  disabled={isLoadingMore}
                  onClick={handleViewMore}
                >
                  {isLoadingMore ? "Loading..." : "View more"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ArticleSection;
