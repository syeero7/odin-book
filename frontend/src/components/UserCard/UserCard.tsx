import { Link } from "react-router-dom";
import type { User as UserProps } from "@/types";
import FollowButton from "@/components/FollowButton";
import styles from "./UserCard.module.css";

function UserCard({ id, username, followers, avatarUrl }: UserProps) {
  return (
    <article className={styles.container}>
      <Link to={`/users/${id}/profile`} viewTransition>
        <img src={avatarUrl} alt="" width={36} height={36} />
        <strong>
          {username.startsWith("#") ? username.slice(1) : username}
        </strong>
      </Link>

      <FollowButton userId={id} followed={followers.length === 1} />
    </article>
  );
}

export default UserCard;
