import { useEffect, useState } from "react";
import { Link } from "react-router";
import { storageService } from "../../appwrite";

interface PostCardProps {
  readonly $id: string;
  readonly title: string;
  readonly featuredImage: string;
}

function PostCard({ $id, title, featuredImage }: PostCardProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      const src = await storageService.getAuthenticatedImageSrc(featuredImage);
      if (isMounted) {
        setImageSrc(src);
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [featuredImage]);

  return (
    <Link to={`/post/${$id}`} className="block h-full">
      <article className="h-full w-full rounded-2xl border border-stone-300 bg-stone-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md dark:border-stone-700 dark:bg-stone-900 dark:hover:border-emerald-500">
        <div className="mb-4 w-full justify-center overflow-hidden rounded-lg">
          <div className="relative h-52 w-full bg-stone-200 dark:bg-stone-800">
            {imageSrc && (
              <img
                className="h-52 w-full rounded-md object-cover"
                src={imageSrc}
                alt={title}
                width={300}
                height={250}
                loading="lazy"
              />
            )}
          </div>
        </div>
        <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-stone-900 dark:text-stone-100 sm:text-xl">
          {title}
        </h2>
      </article>
    </Link>
  );
}

export default PostCard;
