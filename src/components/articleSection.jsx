import { useEffect, useState } from "react";
import CategorySelector from "@/components/categorySelector";
import BlogCard from "@/components/blogCard";
import { formatDate } from "@/lib/formatDate";
import { fetchPosts } from "@/services/blogApi";

const categories = ["Highlight", "Cat", "Inspiration", "General"];

function ArticleSection() {
  const [selectedCategory, setSelectedCategory] = useState("Highlight");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      setIsRefetching(true);

      try {
        const data = await fetchPosts({ category: selectedCategory });
        setPosts(data.posts ?? []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
        setIsRefetching(false);
      }
    };

    loadPosts();
  }, [selectedCategory]);

  const showInitialLoading = isLoading && posts.length === 0;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1366px] px-10 py-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Latest articles</h2>

        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {showInitialLoading ? (
          <p className="text-muted-foreground">Loading articles...</p>
        ) : (
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
        )}
      </div>
    </section>
  );
}

export default ArticleSection;
