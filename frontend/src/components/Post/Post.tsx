import {
  Form,
  Link,
  redirect,
  useFetcher,
  useLocation,
  type ActionFunction,
} from "react-router-dom";
import { formatDistance } from "date-fns";
import { Heart, MessageCircle, Trash } from "lucide-react";

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
  const location = useLocation();
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
            postId={id}
            redirectTo={location.pathname}
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
          redirectTo={location.pathname}
        />

        <Link to={`/posts/${id}`} viewTransition>
          <MessageCircle />
          <span>{_count.comments}</span>
        </Link>
      </div>
    </article>
  );
}

function LikeButton({ liked, count, postId }: LikeButtonProps) {
  const fetcher = useFetcher();
  const postLiked = fetcher.formData?.get("liked") || liked;

  return (
    <fetcher.Form method="post" action={`/posts/${postId}/like`}>
      <button
        name="like"
        value={postLiked ? "false" : "true"}
        aria-label={postLiked ? "unlike post" : "like post"}
        title="like"
        style={{ opacity: fetcher.state !== "idle" ? 0.5 : 1 }}
        className={postLiked ? styles.liked : undefined}
        disabled={fetcher.state !== "idle"}
      >
        <Heart />
      </button>
      <span>{count}</span>
    </fetcher.Form>
  );
}

function DeleteButton({ postId, redirectTo, disabled }: DeleteButtonProps) {
  return (
    <Form
      method="delete"
      action={`/posts/${postId}/delete`}
      viewTransition
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this post?")) {
          e.preventDefault();
          return;
        }
      }}
    >
      <button aria-label="delete post" disabled={disabled}>
        <Trash />
      </button>
      <input type="hidden" name="redirectTo" value={redirectTo} />
    </Form>
  );
}

export const action = (name: "like" | "delete"): ActionFunction => {
  switch (name) {
    case "like":
      return async ({ params, request }) => {
        const data = await request.formData();
        const previousPath = (data.get("redirectTo") as string) || "/";
        const like = data.get("like") as string;

        const res = await likePost(params.postId!, like);
        if (!res.ok) throw res;

        return redirect(previousPath);
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

type LikeButtonProps = {
  liked: boolean;
  count: number;
  postId: number;
  redirectTo: string;
};

type DeleteButtonProps = {
  postId: number;
  redirectTo: string;
  disabled: boolean;
};

export default Post;
