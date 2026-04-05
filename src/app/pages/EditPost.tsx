import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { storageService } from "../../appwrite";
import type { PostRow } from "../../types/post";
import { Container, PostForm } from "../components";

function EditPost() {
  const [post, setPost] = useState<PostRow | null>(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      const response = await storageService.getPostBySlug(slug);

      if (response) {
        setPost(response);
      } else {
        navigate("/"); // redirect if not found
      }
    };

    fetchPost();
  }, [slug, navigate]);

  return post ? (
    <div className="py-8">
      <Container>
        <div className="rounded-2xl border border-stone-300 bg-stone-50 p-4 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-6">
          <PostForm post={post} />
        </div>
      </Container>
    </div>
  ) : null;
}

export default EditPost;
