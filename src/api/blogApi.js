import axios from "axios";
import { DEFAULT_CATEGORY } from "@/constants/blog";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://blogpost-server-flax.vercel.app";

export const DEFAULT_POST_IMAGE =
  "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/g8qpepvgnz6gioylyhrz.jpg";

/**
 * Transforms an API Post object to Frontend Article format
 */
export function transformApiPostToArticle(post) {
  if (!post) return null;
  const authorName = post.author
    ? typeof post.author === "object"
      ? post.author.name || "Thompson P."
      : post.author
    : "Thompson P.";

  return {
    id: post.id,
    title: post.title || "",
    category: post.category || "General",
    category_id: post.category_id,
    description: post.description || "",
    content: post.content || "",
    thumbnail: post.image || DEFAULT_POST_IMAGE,
    image: post.image || DEFAULT_POST_IMAGE,
    status: Number(post.status_id) === 1 ? "published" : "draft",
    status_id: Number(post.status_id) || 1,
    createdAt: post.date || new Date().toISOString(),
    date: post.date || new Date().toISOString(),
    likes_count: post.likes_count || 0,
    author: authorName,
  };
}

/**
 * Transforms Frontend Article form data to API Payload format
 */
export function transformArticleToApiPayload(data) {
  return {
    title: (data.title || "").trim(),
    image: (data.thumbnail || data.image || "").trim() || DEFAULT_POST_IMAGE,
    category: data.category || "General",
    description: (data.description || "").trim(),
    content: (data.content || "").trim(),
    status_id: data.status === "published" || Number(data.status_id) === 1 ? 1 : 2,
  };
}

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
  return {
    ...data,
    posts: (data.posts ?? []).map(transformApiPostToArticle),
  };
}

export async function fetchPostById(id) {
  const { data } = await axios.get(`${API_BASE_URL}/posts/${id}`);
  const rawPost = data.data || data;
  return {
    ...data,
    data: transformApiPostToArticle(rawPost),
  };
}

export async function createPost(articleData) {
  const payload = transformArticleToApiPayload(articleData);
  const { data } = await axios.post(`${API_BASE_URL}/posts`, payload);
  return data;
}

export async function updatePost(id, articleData) {
  const payload = transformArticleToApiPayload(articleData);
  const { data } = await axios.put(`${API_BASE_URL}/posts/${id}`, payload);
  return data;
}

export async function deletePost(id) {
  const { data } = await axios.delete(`${API_BASE_URL}/posts/${id}`);
  return data;
}
