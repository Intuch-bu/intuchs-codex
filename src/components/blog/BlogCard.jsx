import { Link } from "react-router-dom";
import { DEFAULT_AUTHOR_AVATAR } from "@/constants/site";

function BlogCard({ id, image, category, title, description, author, date }) {
  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/post/${id}`}
        className="relative h-[212px] overflow-hidden rounded-2xl md:h-[360px]"
      >
        <img className="size-full object-cover" src={image} alt={title} />
      </Link>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="w-fit rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">
            {category}
          </span>
          <div className="flex flex-col gap-2">
            <Link to={`/post/${id}`}>
              <h2 className="line-clamp-2 text-left text-xl font-semibold leading-7 text-brown-600 hover:underline">
                {title}
              </h2>
            </Link>
            <p className="line-clamp-3 text-sm font-medium leading-[22px] text-brown-400">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2">
            <img
              className="size-6 rounded-full object-cover"
              src={DEFAULT_AUTHOR_AVATAR}
              alt={author}
            />
            <span className="text-brown-500">{author}</span>
          </div>
          <span className="h-[18px] w-px bg-border" />
          <span className="text-brown-400">{date}</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
