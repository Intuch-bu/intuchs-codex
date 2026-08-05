import axios from "axios";
import { DEFAULT_CATEGORY } from "@/constants/blog";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://blogpost-server-flax.vercel.app";

export const DEFAULT_POST_IMAGE =
  "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/g8qpepvgnz6gioylyhrz.jpg";

export async function checkHealth() {
  const { data } = await axios.get(`${API_BASE_URL}/health`);
  return data;
}

export async function fetchPosts({ page = 1, limit = 6, category, keyword } = {}) {
  const params = { page, limit };

  if (category && category !== DEFAULT_CATEGORY && category !== "all") {
    params.category = category;
  }

  if (keyword && keyword.trim()) {
    params.keyword = keyword.trim();
  }

  const { data } = await axios.get(`${API_BASE_URL}/posts`, { params });
  return data;
}

export async function fetchPostById(id) {
  const { data } = await axios.get(`${API_BASE_URL}/posts/${id}`);
  return data;
}

export async function createPost(articleData) {
  const payload = {
    title: (articleData.title || "").trim(),
    image: (articleData.image || articleData.thumbnail || "").trim() || DEFAULT_POST_IMAGE,
    category: articleData.category || "General",
    description: (articleData.description || "").trim(),
    content: (articleData.content || "").trim(),
    status_id: articleData.status === "published" || Number(articleData.status_id) === 1 ? 1 : 2,
  };
  const { data } = await axios.post(`${API_BASE_URL}/posts`, payload);
  return data;
}

export async function updatePost(id, articleData) {
  const payload = {
    title: (articleData.title || "").trim(),
    image: (articleData.image || articleData.thumbnail || "").trim() || DEFAULT_POST_IMAGE,
    category: articleData.category || "General",
    description: (articleData.description || "").trim(),
    content: (articleData.content || "").trim(),
    status_id: articleData.status === "published" || Number(articleData.status_id) === 1 ? 1 : 2,
  };
  const { data } = await axios.put(`${API_BASE_URL}/posts/${id}`, payload);
  return data;
}

export async function deletePost(id) {
  const { data } = await axios.delete(`${API_BASE_URL}/posts/${id}`);
  return data;
}
