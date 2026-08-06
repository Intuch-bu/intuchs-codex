import { createContext, useState, useEffect, useCallback } from "react";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/blogApi";

export const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [categoryObjects, setCategoryObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetchCategories();
      const catData = res.data || res || [];
      if (Array.isArray(catData)) {
        setCategoryObjects(catData);
      }
    } catch (err) {
      console.error("Failed to load categories from API:", err);
      setError("Failed to fetch categories from server.");
    }
  }, []);

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPosts({ limit: 100 });
      if (data.posts && Array.isArray(data.posts)) {
        setArticles(data.posts);
      } else {
        setArticles([]);
      }
    } catch (err) {
      console.error("Failed to load articles from API:", err);
      setError("Failed to fetch articles from server.");
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
    loadCategories();
  }, [loadArticles, loadCategories]);

  const addArticle = async (articleData) => {
    try {
      await createPost(articleData);
      await loadArticles();
      return true;
    } catch (err) {
      console.error("Failed to create article via API:", err);
      const msg = err.response?.data?.message || err.message || "Failed to create article";
      throw new Error(msg);
    }
  };

  const updateArticle = async (id, articleData) => {
    try {
      await updatePost(id, articleData);
      await loadArticles();
      return true;
    } catch (err) {
      console.error("Failed to update article via API:", err);
      const msg = err.response?.data?.message || err.message || "Failed to update article";
      throw new Error(msg);
    }
  };

  const deleteArticle = async (id) => {
    try {
      await deletePost(id);
      await loadArticles();
      return true;
    } catch (err) {
      console.error("Failed to delete article via API:", err);
      const msg = err.response?.data?.message || err.message || "Failed to delete article";
      throw new Error(msg);
    }
  };

  const addCategoryHandler = async (name) => {
    const trimmed = (name || "").trim();
    if (!trimmed) throw new Error("Category name is required");
    try {
      await createCategory(trimmed);
      await loadCategories();
      return true;
    } catch (err) {
      console.error("Failed to create category via API:", err);
      const msg = err.response?.data?.message || err.message || "Failed to create category";
      throw new Error(msg);
    }
  };

  const updateCategoryHandler = async (targetCategory, newName) => {
    const trimmed = (newName || "").trim();
    if (!trimmed) throw new Error("Category name is required");

    let targetId = targetCategory;
    if (typeof targetCategory === "string") {
      const found = categoryObjects.find(
        (c) => c.name.toLowerCase() === targetCategory.toLowerCase()
      );
      if (found) targetId = found.id;
    } else if (typeof targetCategory === "object" && targetCategory?.id) {
      targetId = targetCategory.id;
    }

    try {
      await updateCategory(targetId, trimmed);
      await loadCategories();
      await loadArticles();
      return true;
    } catch (err) {
      console.error("Failed to update category via API:", err);
      const msg = err.response?.data?.message || err.message || "Failed to update category";
      throw new Error(msg);
    }
  };

  const deleteCategoryHandler = async (targetCategory) => {
    let targetId = targetCategory;
    if (typeof targetCategory === "string") {
      const found = categoryObjects.find(
        (c) => c.name.toLowerCase() === targetCategory.toLowerCase()
      );
      if (found) targetId = found.id;
    } else if (typeof targetCategory === "object" && targetCategory?.id) {
      targetId = targetCategory.id;
    }

    try {
      await deleteCategory(targetId);
      await loadCategories();
      return true;
    } catch (err) {
      console.error("Failed to delete category via API:", err);
      const msg = err.response?.data?.message || err.message || "Failed to delete category";
      throw new Error(msg);
    }
  };

  const categories = categoryObjects.map((c) => c.name);

  return (
    <AdminContext.Provider
      value={{
        articles,
        categoryObjects,
        categories,
        isLoading,
        error,
        refetchArticles: loadArticles,
        refetchCategories: loadCategories,
        addArticle,
        updateArticle,
        deleteArticle,
        addCategory: addCategoryHandler,
        updateCategory: updateCategoryHandler,
        deleteCategory: deleteCategoryHandler,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
