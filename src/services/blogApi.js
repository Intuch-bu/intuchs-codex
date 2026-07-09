import axios from "axios";

const API_BASE_URL = "https://blog-post-project-api.vercel.app";

export async function fetchPosts({ page = 1, limit = 6, category, keyword } = {}) {
  const params = { page, limit };

  if (category && category !== "Highlight") {
    params.category = category;
  }

  if (keyword) {
    params.keyword = keyword;
  }

  const { data } = await axios.get(`${API_BASE_URL}/posts`, { params });
  return data;
}

export async function fetchPostById(id) {
  const { data } = await axios.get(`${API_BASE_URL}/posts/${id}`);
  return data;
}
