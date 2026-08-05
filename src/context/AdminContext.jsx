import { createContext, useState, useEffect } from "react";
import {
  getStoredArticles,
  saveStoredArticles,
  getStoredCategories,
  saveStoredCategories,
} from "@/lib/adminData";
import { DEFAULT_AUTHOR_AVATAR } from "@/constants/site";

export const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setArticles(getStoredArticles());
    setCategories(getStoredCategories());
  }, []);

  const addArticle = (articleData) => {
    const newArticle = {
      id: `art-${Date.now()}`,
      title: articleData.title.trim(),
      category: articleData.category,
      status: articleData.status || "draft",
      description: articleData.description.trim(),
      content: articleData.content || "",
      thumbnail: articleData.thumbnail || "",
      createdAt: new Date().toISOString(),
      author: {
        name: "Thompson P.",
        avatar: DEFAULT_AUTHOR_AVATAR,
      },
    };
    const nextArticles = [newArticle, ...articles];
    setArticles(nextArticles);
    saveStoredArticles(nextArticles);
    return newArticle;
  };

  const updateArticle = (id, articleData) => {
    const nextArticles = articles.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          title: articleData.title.trim(),
          category: articleData.category,
          status: articleData.status || item.status,
          description: articleData.description.trim(),
          content: articleData.content || "",
          thumbnail: articleData.thumbnail !== undefined ? articleData.thumbnail : item.thumbnail,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });
    setArticles(nextArticles);
    saveStoredArticles(nextArticles);
  };

  const deleteArticle = (id) => {
    const nextArticles = articles.filter((item) => item.id !== id);
    setArticles(nextArticles);
    saveStoredArticles(nextArticles);
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
