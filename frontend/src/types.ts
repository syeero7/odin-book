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
