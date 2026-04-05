import { Container, PostForm } from "../components";

function AddPost() {
  return (
    <div className="py-8">
      <Container>
        <div className="rounded-2xl border border-stone-300 bg-stone-50 p-4 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-6">
          <PostForm />
        </div>
      </Container>
    </div>
  );
}

export default AddPost;
