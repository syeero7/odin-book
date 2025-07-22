import type { Post } from "@/types";
import { Link } from "react-router-dom";
import DeleteButton from "../DeleteButton";
import { formatDistance } from "date-fns";
import styles from "./ContentHeader.module.css";

function ContentHeader({
  id,
  author,
  userId,
  authorId,
  createdAt,
  contentName,
}: ContentHeaderProps) {
  return (
    <div className={styles.container}>
      <Link to={`/users/${authorId}`} viewTransition>
        <img src={author.avatarUrl} alt="" width={36} height={36} />
        <strong>
          {author.username.startsWith("#")
            ? author.username.slice(1)
            : author.username}
        </strong>
      </Link>

      {userId === authorId && (
        <DeleteButton
          itemId={id}
          itemName={contentName}
          disabled={author.username === import.meta.env.VITE_GUEST_USERNAME}
        />
      )}

      <time dateTime={new Date(createdAt).toISOString()}>
        {formatDistance(new Date(createdAt), new Date(), {
          addSuffix: true,
        })}
      </time>
    </div>
  );
}

type ContentHeaderProps = Omit<
  Post,
  "title" | "_count" | "likes" | "updatedAt"
> & {
  userId: number;
  contentName: "post" | "comment";
};

export default ContentHeader;
