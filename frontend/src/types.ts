import type { FormHTMLAttributes } from "react";

export type AuthUser = {
  id: number;
  username: string;
};

export type FormAction = FormHTMLAttributes<HTMLFormElement>["action"];

type Author = {
  username: string;
  avatarUrl: string;
};

export type Comment = {
  id: number;
  content: string;
  userId: number;
  postId: number;
  createdAt: string;
  updatedAt: string;
  user: Author;
};

export type Post = {
  id: number;
  title: string;
  content?: string;
  imageUrl?: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  comments?: Comment[];
  likes: unknown[];
  _count: {
    likes: number;
    comments: number;
  };
};

export type CreatePostQueries = Array<"text=true" | "image=true">;

export type User = {
  id: number;
  githubId: null | string;
  username: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
  followers: { username: string }[] | [];
};

export type Notification = {
  id: number;
  type: "FOLLOW" | "LIKE" | "COMMENT";
  postId: number | null;
  senderId: number;
  recipientId: number;
  createdAt: Date;
  sender: {
    username: string;
    avatarUrl: string;
  };
};
