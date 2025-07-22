import { redirect, type ActionFunction } from "react-router-dom";
import type { Comment as CommentProps } from "@/types";
import ContentHeader from "@/components/ContentHeader";
import { useAuth } from "@/components/AuthProvider";
import { createComment, deleteComment } from "@/lib/api";
import styles from "./Comment.module.css";

function Comment({ id, content, createdAt, user, userId }: CommentProps) {
  const { user: currentUser } = useAuth();

  return (
    <article className={styles.container}>
      <ContentHeader
        id={id}
        author={user}
        authorId={userId}
        userId={currentUser!.id}
        createdAt={createdAt}
        contentName="comment"
      />

      <p className={styles.comment}>{content}</p>
    </article>
  );
}

export const action = (name: "create" | "delete"): ActionFunction => {
  switch (name) {
    case "create":
      return async ({ request, params }) => {
        const data = await request.formData();
        const content = data.get("content") as string;
        const redirectTo = data.get("redirectTo") as string;

        const res = await createComment(params.postId!, { content });
        if (!res.ok) throw res;

        return redirect(redirectTo);
      };

    case "delete":
      return async ({ params, request }) => {
        const data = await request.formData();
        const redirectTo = data.get("redirectTo") as string;

        const res = await deleteComment(params.commentId!);
        if (!res.ok) throw res;

        return redirect(redirectTo);
      };
  }
};

export default Comment;
