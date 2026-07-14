import {
  DEFAULT_AUTHOR_AVATAR,
  DEFAULT_AUTHOR_BIO,
} from "@/constants/site";

function AuthorCard({ author }) {
  return (
    <aside className="lg:w-[305px] lg:shrink-0">
      <div className="rounded-2xl bg-muted p-6">
        <div className="mb-3 flex items-center gap-3">
          <img
            className="size-11 rounded-full object-cover"
            src={DEFAULT_AUTHOR_AVATAR}
            alt={author}
          />
          <div>
            <p className="text-xs font-medium text-brown-400">Author</p>
            <p className="text-xl font-semibold text-brown-600">{author}</p>
          </div>
        </div>
        <p className="text-base font-medium leading-6 text-brown-400">
          {DEFAULT_AUTHOR_BIO}
        </p>
      </div>
    </aside>
  );
}

export default AuthorCard;
