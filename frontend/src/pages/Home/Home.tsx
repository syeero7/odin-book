import { redirect, useLoaderData } from "react-router-dom";
import { getAllPosts } from "@/lib/api";
import type { Post as PostProps } from "@/types";
import Post from "@/components/Post";
import styles from "./Home.module.css";

function Home() {
  const { posts } = useLoaderData<{ posts: PostProps[] }>();

  return (
    <main className={styles.container}>
      <title>Needle | Home</title>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Post {...post} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No posts</p>
      )}
    </main>
  );
}

export const loader = async () => {
  const res = await getAllPosts();
  if (res.status === 401) return redirect("/login");
  if (!res.ok) throw res;
  return res.json();
};

export default Home;
