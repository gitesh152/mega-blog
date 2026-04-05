import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import type { PostRow } from "../../types/post";
import { useAppSelector } from "../hooks";
import { storageService } from "../../appwrite";

export default function Post() {
  const [post, setPost] = useState<PostRow | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useAppSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      storageService.getPostBySlug(slug).then((post) => {
        if (post) {
          setPost(post);
          setImageFailed(false);
        } else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  useEffect(() => {
    if (!post?.featuredImage) {
      return;
    }

    let isMounted = true;

    const loadImage = async () => {
      setIsImageLoading(true);
      setImageFailed(false);
      const src = await storageService.getAuthenticatedImageSrc(
        post.featuredImage,
      );

      if (!isMounted) return;

      if (!src) {
        setImageFailed(true);
        setImageSrc(null);
        setIsImageLoading(false);
        return;
      }

      setImageSrc(src);
      setIsImageLoading(false);
    };

    loadImage();

    return () => {
      isMounted = false;
      // Don't revoke the object URL - it's managed by the cache
      // Revoking it here causes images to disappear when returning to the list view
    };
  }, [post?.featuredImage]);

  const hasFeaturedImage = Boolean(post?.featuredImage);

  const getImageContent = () => {
    if (hasFeaturedImage && !imageFailed && imageSrc) {
      return "loaded";
    }
    if (hasFeaturedImage && isImageLoading) {
      return "loading";
    }
    return "unavailable";
  };
  const imageState = getImageContent();

  const deletePost = () => {
    if (!post) return;
    storageService.deletePost(post.$id).then((status) => {
      if (status) {
        storageService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  return post ? (
    <div className="py-8">
      <Container>
        <div className="relative mb-4 flex min-h-64 w-full items-center justify-center rounded-2xl border border-stone-300 bg-stone-50 p-2 dark:border-stone-700 dark:bg-stone-900 sm:min-h-80">
          {imageState === "loaded" && (
            <div className="relative w-full">
              <img
                src={imageSrc!}
                alt={post.title}
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setImageFailed(true);
                  setIsImageLoading(false);
                }}
                className={`max-h-128 w-full rounded-xl object-cover transition-opacity ${isImageLoading ? "opacity-0" : "opacity-100"}`}
              />
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-stone-200 dark:bg-stone-800">
                  <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-stone-400/40 border-t-stone-600 dark:border-stone-500/40 dark:border-t-stone-200" />
                </div>
              )}
            </div>
          )}

          {imageState === "loading" && (
            <div className="flex h-64 w-full items-center justify-center rounded-xl bg-stone-200 dark:bg-stone-800 sm:h-80">
              <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-stone-400/40 border-t-stone-600 dark:border-stone-500/40 dark:border-t-stone-200" />
            </div>
          )}

          {imageState === "unavailable" && (
            <div className="flex h-64 w-full items-center justify-center rounded-xl bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300 sm:h-80">
              Image preview unavailable
            </div>
          )}

          {isAuthor && (
            <div className="absolute right-4 top-4 flex flex-col gap-2 sm:right-6 sm:top-6 sm:flex-row">
              <Link to={`/edit-post/${post.$id}`}>
                <Button
                  bgColor="bg-emerald-600 hover:bg-emerald-700"
                  className="w-full sm:mr-3"
                >
                  Edit
                </Button>
              </Link>
              <Button
                bgColor="bg-red-600 hover:bg-red-700"
                onClick={deletePost}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {post.title}
          </h1>
        </div>
        <article className="browser-css">{parse(post.content)}</article>
      </Container>
    </div>
  ) : null;
}
