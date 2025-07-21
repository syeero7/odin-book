import { Link, redirect, type ActionFunction } from "react-router-dom";
import { formatDistance } from "date-fns";
import { MessageCircle } from "lucide-react";

import LikeButton from "@/components/LikeButton";
import DeleteButton from "@/components/DeleteButton";
import { useAuth } from "@/components/AuthProvider";
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
      <div className={styles.top}>
        <Link to={`/users/${authorId}`} viewTransition>
          <img src={author.avatarUrl} alt="" width={45} height={45} />
          <strong>
            {author.username.startsWith("#")
              ? author.username.slice(1)
              : author.username}
          </strong>
        </Link>

        {user?.id === authorId && (
          <DeleteButton
            itemId={id}
            itemName="post"
            disabled={author.username === import.meta.env.VITE_GUEST_USERNAME}
          />
        )}

        <time dateTime={new Date(createdAt).toISOString()}>
          {formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
        </time>
      </div>

      <Link to={`/posts/${id}`} viewTransition className={styles.content}>
        <strong>{title}</strong>
        {content && <p>{content}</p>}
        {imageUrl && <img src={imageUrl} alt="" />}
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
