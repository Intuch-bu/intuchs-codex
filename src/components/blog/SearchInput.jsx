import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchPosts } from "@/api/blogApi";

function SearchInput() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) {
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

  const handleKeywordChange = (event) => {
    const nextKeyword = event.target.value;
    setKeyword(nextKeyword);

    if (!nextKeyword.trim()) {
      setResults([]);
      setIsOpen(false);
    }
  };

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
          onChange={handleKeywordChange}
          onFocus={() => {
            if (results.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder="Search"
          className="h-11 rounded-lg border-border bg-white pr-10 placeholder:text-brown-400"
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

export default SearchInput;
