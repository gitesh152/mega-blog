import { Query } from "appwrite";
import { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import { storageService } from "../../appwrite";
import type { PostRow } from "../../types/post";
import { useAppSelector } from "../hooks";

function AllPosts() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const userId = useAppSelector((state) => state.auth.userData?.$id);

  useEffect(() => {
    let isCancelled = false;

    if (!userId) {
      return () => {
        isCancelled = true;
      };
    }

    const fetchPosts = async () => {
      const response = await storageService.getPosts([
        Query.equal("status", "active"),
        Query.equal("userId", userId),
      ]);

      if (!isCancelled && response && "rows" in response) {
        setPosts(response.rows);
      }
    };

    fetchPosts();
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(userId ? posts : []).map((post) => (
            <div key={post.$id} className="h-full">
              <PostCard
                $id={post.$id}
                title={post.title}
                featuredImage={post.featuredImage}
              />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
