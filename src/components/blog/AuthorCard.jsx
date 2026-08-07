function AuthorCard({ author, author_name, author_avatar, author_bio }) {
  const authorName =
    author_name ||
    (typeof author === "object" ? author?.name : author) ||
    "Author";
  const authorPic =
    author_avatar ||
    (typeof author === "object" ? author?.avatar : null) ||
    "";
  const bioText =
    author_bio ||
    (typeof author === "object" ? author?.bio : null) ||
    "";

  return (
    <aside className="lg:w-[305px] lg:shrink-0">
      <div className="rounded-2xl bg-muted p-6">
        <div className="mb-3 flex items-center gap-3">
          <img
            className="size-11 rounded-full object-cover"
            src={authorPic}
            alt={authorName}
          />
          <div>
            <p className="text-xs font-medium text-brown-400">Author</p>
            <p className="text-xl font-semibold text-brown-600">{authorName}</p>
          </div>
        </div>
        <p className="text-base font-medium leading-6 text-brown-400">
          {bioText}
        </p>
      </div>
    </aside>
  );
}

export default AuthorCard;
