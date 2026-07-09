import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchPosts } from "@/services/blogApi";

function SearchInput() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);

      try {
        const data = await fetchPosts({ keyword: keyword.trim(), limit: 6 });
        setResults(data.posts ?? []);
        setIsOpen(true);
      } catch (error) {
        console.error("Failed to search posts:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPost = (postId) => {
    setKeyword("");
    setResults([]);
    setIsOpen(false);
    navigate(`/post/${postId}`);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder="Search"
          className="h-11 rounded-lg border-border bg-background pr-10"
        />
        <Search className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-muted-foreground" />
      </div>

      {isOpen && keyword.trim() && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-border bg-background shadow-lg">
          {isSearching ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">Searching...</p>
          ) : results.length > 0 ? (
            <ul>
              {results.map((post) => (
                <li key={post.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectPost(post.id)}
                    className="w-full px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
                  >
                    {post.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              No articles found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CategorySelector({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="mt-4 rounded-2xl bg-muted px-4 py-4 md:px-6">
      <div className="hidden items-center justify-between gap-4 md:flex">
        <div className="flex items-center gap-2">
          {categories.map((category) => {
            const isSelected = category === selectedCategory;

            return (
              <button
                key={category}
                type="button"
                disabled={isSelected}
                onClick={() => onCategoryChange(category)}
                className={
                  isSelected
                    ? "rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground"
                    : "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-background/60"
                }
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="w-full max-w-sm">
          <SearchInput />
        </div>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        <SearchInput />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-muted-foreground">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-11 w-full rounded-lg border-border bg-background">
              <SelectValue placeholder="Highlight" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default CategorySelector;
