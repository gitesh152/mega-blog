import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAppSelector } from "../hooks";
import { storageService } from "../../appwrite";
import { useCallback } from "react";
import type { PostRow } from "../../types/post";
import { Button, FeaturedImagePreview, Input, RealTimeEditor, Select } from ".";

type PostFormData = {
  title: string;
  slug: string;
  content: string;
  status: "active" | "inactive";
  image: FileList;
};

type PostFormProps = {
  readonly post?: PostRow;
};

function PostForm({ post }: PostFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { isSubmitting },
  } = useForm<PostFormData>({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const userData = useAppSelector((state) => state.auth.userData);

  const uploadPostImage = useCallback(
    async (imageFile: File | undefined) => {
      if (!imageFile) return null;
      return await storageService.uploadFile(imageFile, userData?.$id || "");
    },
    [userData?.$id],
  );

  const handleUpdatePost = useCallback(
    async (data: PostFormData, file: any) => {
      if (!post) return;

      if (file) {
        await storageService.deleteFile(post.featuredImage);
      }

      const payload = {
        title: data.title,
        content: data.content,
        status: data.status,
        featuredImage: file ? file.$id : post.featuredImage,
      };

      const dbPost = await storageService.updatePost(post.$id, payload);
      if (dbPost) navigate(`/post/${dbPost.$id}`);
    },
    [post, navigate],
  );

  const handleCreatePost = useCallback(
    async (data: PostFormData, file: any) => {
      if (!userData || !file) return;

      const payload = {
        ...data,
        featuredImage: file.$id,
        userId: userData.$id,
      };

      const dbPost = await storageService.createPost(payload);
      if (dbPost) navigate(`/post/${dbPost.$id}`);
    },
    [userData, navigate],
  );

  const submit: SubmitHandler<PostFormData> = async (data) => {
    try {
      if (!userData) return;

      const file = await uploadPostImage(data.image?.[0]);

      if (post) {
        await handleUpdatePost(data, file);
      } else {
        await handleCreatePost(data, file);
      }
    } catch (error) {
      console.error("Post submit error:", error);
    }
  };

  // Auto-generate slug from title (replaces spaces with dashes and removes special characters)
  const slugTransform = useCallback((value: string) => {
    return value
      ?.trim()
      .toLowerCase()
      .replaceAll(/[^a-zA-Z\d\s]+/g, "-")
      .replaceAll(/\s+/g, "-");
  }, []);

  // Determine button text based on submission state and form mode
  const getButtonText = () => {
    if (isSubmitting) return "Saving...";
    return post ? "Update" : "Submit";
  };
  const buttonText = getButtonText();

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-6 lg:flex-row"
    >
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          disabled={isSubmitting}
          {...register("title", {
            required: true,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setValue("slug", slugTransform(e.target.value), {
                shouldValidate: true,
              });
            },
          })}
        />

        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          disabled={isSubmitting}
          {...register("slug", { required: true })}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setValue("slug", slugTransform(value), {
              shouldValidate: true,
            });
          }}
        />

        <RealTimeEditor
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      {/* RIGHT */}
      <aside className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-900 lg:w-1/3">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          disabled={isSubmitting}
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />

        {post && (
          <FeaturedImagePreview
            key={post.featuredImage}
            src={storageService.getFile(post.featuredImage)}
            title={post.title}
          />
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          disabled={isSubmitting}
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          bgColor={post ? "bg-emerald-600 hover:bg-emerald-700" : undefined}
          className="flex w-full items-center justify-center gap-2"
        >
          {isSubmitting && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
          )}
          {buttonText}
        </Button>
      </aside>
    </form>
  );
}

export default PostForm;
