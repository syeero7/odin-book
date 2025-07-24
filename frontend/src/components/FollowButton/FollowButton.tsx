import { useFetcher, type ActionFunctionArgs } from "react-router-dom";
import { followUser } from "@/lib/api";
import styles from "./FollowButton.module.css";

function FollowButton({ followed, userId }: FollowButtonProps) {
  const fetcher = useFetcher();
  const userFollowed = fetcher.formData?.get("") || followed;

  return (
    <fetcher.Form
      method="put"
      className={styles.container}
      action={`/users/${userId}/follow?q=${!userFollowed}`}>
      <button
        name="follow"
        disabled={fetcher.state !== "idle"}
        value={`${!userFollowed}`}
        aria-label={userFollowed ? "unfollow user" : "follow user"}>
        {userFollowed ? "Unfollow" : "Follow"}
      </button>
    </fetcher.Form>
  );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") as string;

  const res = await followUser(params.userId!, query);
  if (!res.ok) throw res;
};

type FollowButtonProps = {
  followed: boolean;
  userId: number;
};

export default FollowButton;
