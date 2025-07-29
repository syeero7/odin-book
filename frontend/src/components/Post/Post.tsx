import { Link, redirect, type ActionFunction } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import LikeButton from "@/components/LikeButton";
import { useAuth } from "@/components/AuthProvider";
import ContentHeader from "@/components/ContentHeader";
import type { Post as PostProps } from "@/types";
import { deletePost, likePost } from "@/lib/api";
import styles from "./Post.module.css";

function Post({
  id,
  title,
  content,
  createdAt,
  imageUrl,
  author,
  authorId,
  _count,
  likes,
}: PostProps) {
  const { user } = useAuth();

  return (
    <article className={styles.container}>
      <ContentHeader
        id={id}
        author={author}
        authorId={authorId}
        userId={user?.id}
        createdAt={createdAt}
        contentName="post"
      />
      <Link to={`/posts/${id}`} viewTransition className={styles.content}>
        <strong>{title}</strong>
        {imageUrl && <img src={imageUrl} alt="" />}
        {content && <p>{content}</p>}
      </Link>

      <div className={styles.buttons}>
        <LikeButton
          postId={id}
          count={_count.likes}
          liked={likes.length !== 0}
          className={styles.liked}
        />

        <Link to={`/posts/${id}`} viewTransition>
          <MessageCircle />
          <span>{_count.comments}</span>
        </Link>
      </div>
    </article>
  );
}

export const action = (name: "like" | "delete"): ActionFunction => {
  switch (name) {
    case "like":
      return async ({ params, request }) => {
        const data = await request.formData();
        const like = data.get("like") as string;

        const res = await likePost(params.postId!, like);
        if (!res.ok) throw res;
      };

    case "delete":
      return async ({ params, request }) => {
        const data = await request.formData();
        const previousPath = (data.get("redirectTo") as string) || "/";

        const res = await deletePost(params.postId!);
        if (!res.ok) throw res;

        return redirect(previousPath);
      };
  }
};

export default Post;
