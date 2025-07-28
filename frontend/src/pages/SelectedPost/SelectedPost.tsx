import { Form, useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import type { Post as PostProps } from "@/types";
import { getPostById } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import ContentHeader from "@/components/ContentHeader";
import SubmitButton from "@/components/SubmitButton";
import LikeButton from "@/components/LikeButton";
import Comment from "@/components/Comment";
import styles from "./SelectedPost.module.css";

function SelectedPost() {
  const { user } = useAuth();
  const { post } = useLoaderData<{ post: PostProps }>();
  const {
    id,
    author,
    authorId,
    createdAt,
    imageUrl,
    content,
    comments,
    title,
    _count,
    likes,
  } = post;

  return (
    <main className={styles.container}>
      <title>{`Needle | Post: ${post.title}`}</title>
      <section className={styles.post}>
        <header>
          <ContentHeader
            id={id}
            author={author}
            authorId={authorId}
            userId={user!.id}
            createdAt={createdAt}
            contentName="post"
          />

          <h1>{title}</h1>
        </header>

        {imageUrl && <img src={imageUrl} alt="" width={280} height={280} />}
        {content && <p>{content}</p>}

        <div className={styles.buttons}>
          <LikeButton
            postId={id}
            count={_count.likes}
            liked={likes.length !== 0}
            className={styles.liked}
          />

          <div>
            <MessageCircle />
            <span>{_count.comments}</span>
          </div>
        </div>
      </section>

      <section className={styles.comments}>
        <hr />
        <CreateCommentForm postId={id} />
        <hr />
        {!comments?.length ? (
          <p className={styles.empty}>Create a new comment</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <Comment {...comment} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function CreateCommentForm({ postId }: { postId: number }) {
  return (
    <Form viewTransition method="post" action={`/posts/${postId}/comment`}>
      <textarea
        required
        name="content"
        maxLength={300}
        placeholder="Add a comment..."></textarea>
      <SubmitButton>Comment</SubmitButton>
    </Form>
  );
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const res = await getPostById(params.postId!);
  if (!res.ok) throw res;
  return res.json();
};

export default SelectedPost;
