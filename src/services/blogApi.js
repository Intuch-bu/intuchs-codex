import axios from "axios";

const API_BASE_URL = "https://blog-post-project-api.vercel.app";

export async function fetchPosts({ page = 1, limit = 6, category } = {}) {
  const params = { page, limit };

  if (category && category !== "Highlight") {
    params.category = category;
  }

  const { data } = await axios.get(`${API_BASE_URL}/posts`, { params });
  return data;
}
