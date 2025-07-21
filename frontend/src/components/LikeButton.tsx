import { useFetcher } from "react-router-dom";
import { Heart } from "lucide-react";

function LikeButton({ liked, count, postId, className }: LikeButtonProps) {
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
        className={postLiked ? className : undefined}
        disabled={fetcher.state !== "idle"}
      >
        <Heart />
      </button>
      <span>{count}</span>
    </fetcher.Form>
  );
}

type LikeButtonProps = {
  liked: boolean;
  count: number;
  postId: number;
  className: string;
};

export default LikeButton;
