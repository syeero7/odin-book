import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import Post from "@/components/Post";
import UserCard from "@/components/UserCard";
import FollowButton from "@/components/FollowButton";
import { getUserConnections, getUserPosts, getUserProfile } from "@/lib/api";
import type {
  Post as PostProps,
  User as UserProps,
  Profile as ProfileProps,
} from "@/types";
import styles from "./Profile.module.css";

function Profile() {
  const { profile, content, users, posts } = useLoaderData<LoaderData>();
  const title = `${content[0].toUpperCase()}${content.slice(1)}`;

  return (
    <main>
      <title>{`Needle | Profile: ${title}`}</title>
      <ProfileContent {...profile} />
      <section className={styles.content}>
        <h2>{title}</h2>
        <hr />
        {(content === "posts" || content === "liked") && (
          <PostContent posts={posts} />
        )}
        {(content === "followers" || content === "following") && (
          <UserContent users={users} />
        )}
      </section>
    </main>
  );
}

function ProfileContent({
  id,
  avatarUrl,
  username,
  followers,
  _count,
}: ProfileProps) {
  const { user } = useAuth();

  return (
    <section className={styles.profile}>
      <header>
        <img src={avatarUrl} alt="" width={200} height={200} />
        <div>
          <h1>{username.startsWith("#") ? username.slice(1) : username}</h1>

          <div className={styles.follow}>
            {id !== user?.id && (
              <FollowButton followed={followers.length === 1} userId={id} />
            )}
          </div>
        </div>
      </header>

      <div className={styles.links}>
        <Link to={`/users/${id}/profile?content=followers`} viewTransition>
          {_count.followers} followers
        </Link>
        <Link to={`/users/${id}/profile?content=following`} viewTransition>
          {_count.following} following
        </Link>
        <Link to={`/users/${id}/profile?content=posts`} viewTransition>
          {_count.posts} posts
        </Link>
        <Link to={`/users/${id}/profile?content=liked`} viewTransition>
          {_count.likes} liked posts
        </Link>
      </div>
    </section>
  );
}

function PostContent({ posts }: Pick<LoaderData, "posts">) {
  return !posts?.length ? (
    <p className={styles.empty}>No posts</p>
  ) : (
    <ul className={styles.posts}>
      {posts.map((post) => (
        <li key={post.id}>
          <Post {...post} />
        </li>
      ))}
    </ul>
  );
}

function UserContent({ users }: Pick<LoaderData, "users">) {
  return !users?.length ? (
    <p className={styles.empty}>No users</p>
  ) : (
    <ul className={styles.users}>
      {users.map((user) => (
        <li key={user.id}>
          <UserCard {...user} />
        </li>
      ))}
    </ul>
  );
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const content = (searchParams.get("content") as PageContent) || "posts";
  const { userId } = params;
  const data: Partial<LoaderData> = {};
  data.content = content;

  const res = await getUserProfile(userId!);
  if (!res.ok) throw res;

  const { profile } = await res.json();
  data.profile = profile;

  if (content === "followers" || content === "following") {
    const res =
      content === "followers"
        ? await getUserConnections(userId!, "followers")
        : await getUserConnections(userId!, "following");
    if (!res.ok) throw res;

    const { users } = await res.json();
    data.users = users;
  }

  if (content === "posts" || content === "liked") {
    const res =
      content === "posts"
        ? await getUserPosts(userId!)
        : await getUserPosts(userId!, true);
    if (!res.ok) throw res;

    const { posts } = await res.json();
    data.posts = posts;
  }

  return data;
};

type LoaderData = {
  profile: ProfileProps;
  users?: UserProps[];
  posts?: PostProps[];
  content: PageContent;
};

type PageContent = "followers" | "following" | "posts" | "liked";

export default Profile;
