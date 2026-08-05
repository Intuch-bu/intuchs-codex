import { createContext, useState, useEffect, useCallback } from "react";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} from "@/api/blogApi";
import {
  getStoredArticles,
  saveStoredArticles,
  getStoredCategories,
  saveStoredCategories,
} from "@/lib/adminData";

export const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPosts({ limit: 100 });
      if (data.posts && Array.isArray(data.posts)) {
        setArticles(data.posts);
        saveStoredArticles(data.posts);
      } else {
        setArticles(getStoredArticles());
      }
    } catch (err) {
      console.error("Failed to load articles from API:", err);
      setError("Failed to fetch articles from server. Using cached data.");
      setArticles(getStoredArticles());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
    setCategories(getStoredCategories());
  }, [loadArticles]);

  const addArticle = async (articleData) => {
    try {
      await createPost(articleData);
      await loadArticles();
      return true;
    } catch (err) {
      console.error("Failed to create article via API:", err);
      // Fallback local addition if API fails
      const fallbackArticle = {
        id: `art-${Date.now()}`,
        title: articleData.title.trim(),
        category: articleData.category,
        status: articleData.status || "draft",
        description: articleData.description.trim(),
        content: articleData.content || "",
        thumbnail: articleData.thumbnail || "",
        createdAt: new Date().toISOString(),
      };
      const nextArticles = [fallbackArticle, ...articles];
      setArticles(nextArticles);
      saveStoredArticles(nextArticles);
      return fallbackArticle;
    }
  };

  const updateArticle = async (id, articleData) => {
    try {
      await updatePost(id, articleData);
      await loadArticles();
      return true;
    } catch (err) {
      console.error("Failed to update article via API:", err);
      const nextArticles = articles.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title: articleData.title.trim(),
            category: articleData.category,
            status: articleData.status || item.status,
            description: articleData.description.trim(),
            content: articleData.content || "",
            thumbnail:
              articleData.thumbnail !== undefined ? articleData.thumbnail : item.thumbnail,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });
      setArticles(nextArticles);
      saveStoredArticles(nextArticles);
      return false;
    }
  };

  const deleteArticle = async (id) => {
    try {
      await deletePost(id);
      await loadArticles();
      return true;
    } catch (err) {
      console.error("Failed to delete article via API:", err);
      const nextArticles = articles.filter((item) => item.id !== id);
      setArticles(nextArticles);
      saveStoredArticles(nextArticles);
      return false;
    }
  };

  const addCategory = (name) => {
    const trimmed = name.trim();
    if (!trimmed || categories.includes(trimmed)) return false;
    const nextCategories = [...categories, trimmed];
    setCategories(nextCategories);
    saveStoredCategories(nextCategories);
    return true;
  };

  const updateCategory = (oldName, newName) => {
    const trimmed = newName.trim();
    if (!trimmed || (trimmed !== oldName && categories.includes(trimmed))) return false;

    const nextCategories = categories.map((cat) => (cat === oldName ? trimmed : cat));
    setCategories(nextCategories);
    saveStoredCategories(nextCategories);

    const nextArticles = articles.map((art) =>
      art.category === oldName ? { ...art, category: trimmed } : art
    );
    setArticles(nextArticles);
    saveStoredArticles(nextArticles);
    return true;
  };

  const deleteCategory = (name) => {
    const nextCategories = categories.filter((cat) => cat !== name);
    setCategories(nextCategories);
    saveStoredCategories(nextCategories);
  };

  return (
    <AdminContext.Provider
      value={{
        articles,
        categories,
        isLoading,
        error,
        refetchArticles: loadArticles,
        addArticle,
        updateArticle,
        deleteArticle,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
