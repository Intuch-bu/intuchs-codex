import CategorySelector from "@/components/categorySelector";
import BlogCard from "@/components/blogCard";
import { blogPosts } from "@/assets/blogPosts";

const categories = ["Highlight", "Development", "Inspiration", "Warhammer40k"];

function ArticleSection() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1366px] px-10 py-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Latest articles</h2>

        <CategorySelector categories={categories} defaultValue="Highlight" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArticleSection;
