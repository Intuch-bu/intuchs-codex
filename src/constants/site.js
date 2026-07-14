export const DEFAULT_AUTHOR_AVATAR =
  "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg";

export const SITE_AUTHOR = {
  name: "Thompson P.",
  bio: "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.",
  bioExtra:
    "When i'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.",
};

export const DEFAULT_AUTHOR_BIO = SITE_AUTHOR.bio;

export const NOTIFICATIONS = [
  {
    id: 1,
    title: "Thompson P.",
    message: "Published a new article",
    time: "2 hours ago",
    avatar: DEFAULT_AUTHOR_AVATAR,
  },
  {
    id: 2,
    title: "Jacob Josh",
    message: "Commented on the article 'Will the deep dark forest...'",
    time: "4 hours ago",
    avatar: "",
  },
];

export const MOCK_COMMENTS = [
  {
    id: 1,
    name: "Jacob Lash",
    date: "12 September 2024 at 18:30",
    avatar: DEFAULT_AUTHOR_AVATAR,
    body: "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
  },
  {
    id: 2,
    name: "Ahri",
    date: "12 September 2024 at 18:30",
    avatar: "",
    body: "Such a great read! I've always wondered why my cat slow blinks at me—now I know it’s her way of showing trust!",
  },
  {
    id: 3,
    name: "Mimi mama",
    date: "12 September 2024 at 18:30",
    avatar: "",
    body: "This article perfectly captures why cats make such amazing pets. I had no idea their purring could help with healing. Fascinating stuff!",
  },
];
