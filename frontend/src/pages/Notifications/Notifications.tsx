import { Link, useLoaderData } from "react-router-dom";
import { formatDistance } from "date-fns";
import type { Notification as NotificationProps } from "@/types";
import { getNotifications } from "@/lib/api";
import styles from "./Notifications.module.css";

function Notifications() {
  const { notifications } = useLoaderData<{
    notifications: NotificationProps[];
  }>();

  return (
    <main className={styles.container}>
      {!notifications.length ? (
        <p className={styles.empty}>No notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li>
              <NotificationLink {...notification} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function NotificationLink({
  sender,
  createdAt,
  type,
  senderId,
  postId,
}: NotificationProps) {
  return (
    <Link
      to={`/${type === "FOLLOW" ? "users" : "posts"}/${
        type === "FOLLOW" ? senderId : postId
      }`}
      viewTransition>
      <img src={sender.avatarUrl} alt="" width={36} height={36} />

      <p>
        <strong>
          {sender.username.startsWith("#")
            ? sender.username.slice(1)
            : sender.username}
        </strong>
        {type === "FOLLOW"
          ? " started following you."
          : type === "COMMENT"
          ? " commented on your post."
          : " liked your post."}
      </p>

      <time dateTime={new Date(createdAt).toISOString()}>
        {formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
      </time>
    </Link>
  );
}

export const loader = async () => {
  const res = await getNotifications();
  if (!res.ok) throw res;

  return res.json();
};

export default Notifications;
