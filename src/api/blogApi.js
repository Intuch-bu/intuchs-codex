import axios from "axios";
import { DEFAULT_CATEGORY } from "@/constants/blog";
import { supabase } from "@/lib/supabaseClient";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://blogpost-server-flax.vercel.app";

export const DEFAULT_POST_IMAGE =
  "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/g8qpepvgnz6gioylyhrz.jpg";

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// ─── Public endpoints (no auth required) ───

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

export async function fetchCategories() {
  const { data } = await axios.get(`${API_BASE_URL}/categories`);
  return data;
}

// ─── Authenticated endpoints ───

export async function createPost(articleData) {
  const headers = await getAuthHeaders();
  const payload = {
    title: (articleData.title || "").trim(),
    image: (articleData.image || articleData.thumbnail || "").trim() || DEFAULT_POST_IMAGE,
    category: articleData.category || "General",
    description: (articleData.description || "").trim(),
    content: (articleData.content || "").trim(),
    status_id: articleData.status === "published" || Number(articleData.status_id) === 1 ? 1 : 2,
  };
  const { data } = await axios.post(`${API_BASE_URL}/posts`, payload, { headers });
  return data;
}

export async function updatePost(id, articleData) {
  const headers = await getAuthHeaders();
  const payload = {
    title: (articleData.title || "").trim(),
    image: (articleData.image || articleData.thumbnail || "").trim() || DEFAULT_POST_IMAGE,
    category: articleData.category || "General",
    description: (articleData.description || "").trim(),
    content: (articleData.content || "").trim(),
    status_id: articleData.status === "published" || Number(articleData.status_id) === 1 ? 1 : 2,
  };
  const { data } = await axios.put(`${API_BASE_URL}/posts/${id}`, payload, { headers });
  return data;
}

export async function deletePost(id) {
  const headers = await getAuthHeaders();
  const { data } = await axios.delete(`${API_BASE_URL}/posts/${id}`, { headers });
  return data;
}

export async function createCategory(name) {
  const headers = await getAuthHeaders();
  const { data } = await axios.post(`${API_BASE_URL}/categories`, { name }, { headers });
  return data;
}

export async function updateCategory(id, name) {
  const headers = await getAuthHeaders();
  const { data } = await axios.put(`${API_BASE_URL}/categories/${id}`, { name }, { headers });
  return data;
}

export async function deleteCategory(id) {
  const headers = await getAuthHeaders();
  const { data } = await axios.delete(`${API_BASE_URL}/categories/${id}`, { headers });
  return data;
}

// ─── User profile endpoints ───

export async function fetchUserProfile() {
  const headers = await getAuthHeaders();
  const { data } = await axios.get(`${API_BASE_URL}/users/profile`, { headers });
  return data;
}

export async function updateUserProfile(profileData) {
  const headers = await getAuthHeaders();
  const { data } = await axios.put(`${API_BASE_URL}/users/profile`, profileData, { headers });
  return data;
}

export async function uploadProfilePicture(file) {
  const headers = await getAuthHeaders();
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(`${API_BASE_URL}/users/profile-picture`, formData, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

// ─── Comments endpoints ───

export async function fetchComments(postId) {
  const { data } = await axios.get(`${API_BASE_URL}/posts/${postId}/comments`);
  return data;
}

export async function addComment(postId, comment_text) {
  const headers = await getAuthHeaders();
  const { data } = await axios.post(
    `${API_BASE_URL}/posts/${postId}/comments`,
    { comment_text },
    { headers }
  );
  return data;
}

// ─── Likes endpoints ───

export async function fetchLikeStatus(postId) {
  const headers = await getAuthHeaders();
  const { data } = await axios.get(`${API_BASE_URL}/posts/${postId}/like-status`, { headers });
  return data;
}

export async function toggleLike(postId) {
  const headers = await getAuthHeaders();
  const { data } = await axios.post(`${API_BASE_URL}/posts/${postId}/like`, {}, { headers });
  return data;
}

// ─── Notifications endpoint ───

export async function fetchNotifications() {
  const { data } = await axios.get(`${API_BASE_URL}/notifications`);
  return data;
}
