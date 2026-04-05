import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import type { PostRow } from "../../types/post";
import { storageService } from "../../appwrite";
import { Container, PostCard } from "../components";
import { useAppSelector } from "../hooks";

function Home() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const authStatus = useAppSelector((state) => state.auth.status);
  const userData = useAppSelector((state) => state.auth.userData);

  const greetingName = useMemo(() => {
    const trimmedName = userData?.name?.trim();

    if (trimmedName) {
      return trimmedName;
    }

    const emailPrefix = userData?.email?.split("@")[0]?.trim();
    return emailPrefix || "there";
  }, [userData?.email, userData?.name]);

  useEffect(() => {
    let isCancelled = false;

    if (!authStatus) {
      return () => {
        isCancelled = true;
      };
    }

    const fetchPosts = async () => {
      setIsLoading(true);

      const response = await storageService.getPosts();

      if (!isCancelled && response && "rows" in response) {
        setPosts(response.rows);
      }

      if (!isCancelled) {
        setIsLoading(false);
      }
    };

    fetchPosts();
    return () => {
      isCancelled = true;
    };
  }, [authStatus]);

  if (!authStatus) {
    return (
      <div className="mt-4 w-full py-8 text-center">
        <Container>
          <div className="flex flex-wrap rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-10 dark:border-stone-700 dark:bg-stone-900">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold text-stone-900 transition hover:text-emerald-700 dark:text-stone-100 dark:hover:text-emerald-400">
                Welcome to Mega Blog
              </h1>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
                Please login to see your posts.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <Link
                  to="/login"
                  className="rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Signup
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full py-8 text-center">
        <Container>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Loading your posts...
          </p>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Container>
        <div className="mb-6 rounded-2xl border border-stone-300 bg-stone-50 px-4 py-4 dark:border-stone-700 dark:bg-stone-900">
          <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            Hi {greetingName}, welcome.
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
            Here are all active posts from the community.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-10 text-center dark:border-stone-700 dark:bg-stone-900">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              No active posts yet.
            </h2>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
              Create your first post from the Add Post page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.$id} className="h-full">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default Home;
