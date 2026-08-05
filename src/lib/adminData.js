import { DEFAULT_AUTHOR_AVATAR } from "@/constants/site";

const ARTICLES_KEY = "blog_admin_articles";
const CATEGORIES_KEY = "blog_admin_categories";

export const INITIAL_CATEGORIES = [
  "Cat",
  "Inspiration",
  "General",
  "Technology",
  "Design",
  "Business",
  "Lifestyle",
];

export const INITIAL_ARTICLES = [
  {
    id: "art-1",
    title: "The Silent Language of Cats: How to Understand Your Feline Friend",
    category: "Cat",
    status: "published",
    description: "Cats communicate through subtle cues like tail movements and purring. Learn to decode what your cat is trying to tell you.",
    content: "Cats are mysterious creatures, but they communicate constantly through body language and vocalizations. Understanding these subtle signals can help you build a stronger bond with your feline companion...",
    thumbnail: "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg",
    createdAt: "2024-09-12T10:00:00.000Z",
    author: {
      name: "Thompson P.",
      avatar: DEFAULT_AUTHOR_AVATAR,
    },
  },
  {
    id: "art-2",
    title: "10 Daily Habits of Highly Effective Product Designers",
    category: "Design",
    status: "published",
    description: "Discover essential routines and workflows that elevate design quality and foster creative problem-solving daily.",
    content: "Product design is not just about making things look beautiful; it's about solving real human problems efficiently...",
    thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
    createdAt: "2024-09-10T14:30:00.000Z",
    author: {
      name: "Thompson P.",
      avatar: DEFAULT_AUTHOR_AVATAR,
    },
  },
  {
    id: "art-3",
    title: "Draft Article: Next-Gen Web Development in 2026",
    category: "Technology",
    status: "draft",
    description: "A preliminary look at full-stack AI integrations and modern React patterns.",
    content: "Web development is shifting rapidly with AI-driven workflows and new reactive frameworks...",
    thumbnail: "",
    createdAt: "2024-09-08T09:15:00.000Z",
    author: {
      name: "Thompson P.",
      avatar: DEFAULT_AUTHOR_AVATAR,
    },
  },
];

export function getStoredArticles() {
  try {
    const raw = localStorage.getItem(ARTICLES_KEY);
    if (!raw) {
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ARTICLES;
  }
}

export function saveStoredArticles(articles) {
  try {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  } catch (err) {
    console.error("Failed to save articles", err);
  }
}

export function getStoredCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export function saveStoredCategories(categories) {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error("Failed to save categories", err);
  }
}
