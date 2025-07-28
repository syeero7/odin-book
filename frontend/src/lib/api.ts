import type { CreatePostQueries } from "@/types";
import { getItem } from "@/lib/storage";

const { VITE_BACKEND_URL } = import.meta.env;

export function getCurrentUser() {
  return fetch(`${VITE_BACKEND_URL}/users/me`, {
    headers: { ...getAuthorizationHeader() },
  });
}

export function getAllPosts() {
  return fetch(`${VITE_BACKEND_URL}/posts`, {
    headers: { ...getAuthorizationHeader() },
  });
}

export function deletePost(postId: string | number) {
  return fetch(`${VITE_BACKEND_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: { ...getAuthorizationHeader() },
  });
}

export function likePost(postId: string | number, like: string) {
  return fetch(`${VITE_BACKEND_URL}/posts/${postId}?like=${like}`, {
    method: "PUT",
    headers: { ...getAuthorizationHeader() },
  });
}

export function getPostById(postId: string | number) {
  return fetch(`${VITE_BACKEND_URL}/posts/${postId}`, {
    headers: { ...getAuthorizationHeader() },
  });
}

export function getUserPosts(userId: string | number, liked: boolean = false) {
  return fetch(`${VITE_BACKEND_URL}/posts/users/${userId}?liked=${liked}`, {
    headers: { ...getAuthorizationHeader() },
  });
}

export function createPost(formData: FormData, queries: CreatePostQueries) {
  const queriesStr = queries.length ? `?${queries.join("&")}` : "";
  return fetch(`${VITE_BACKEND_URL}/posts${queriesStr}`, {
    method: "POST",
    body: formData,
    headers: { ...getAuthorizationHeader() },
  });
}

export function createComment(postId: string | number, body: object) {
  return fetch(`${VITE_BACKEND_URL}/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      ...getAuthorizationHeader(),
      "Content-type": "application/json",
    },
  });
}

export function deleteComment(commentId: string | number) {
  return fetch(`${VITE_BACKEND_URL}/posts/comments/${commentId}`, {
    method: "DELETE",
    headers: { ...getAuthorizationHeader() },
  });
}

export function searchUsers(query: string) {
  return fetch(`${VITE_BACKEND_URL}/users/search?q=${query}`, {
    headers: { ...getAuthorizationHeader() },
  });
}

export function getUserProfile(userId: string | number) {
  return fetch(`${VITE_BACKEND_URL}/users/${userId}/profile`, {
    headers: { ...getAuthorizationHeader() },
  });
}

export function followUser(userId: string | number, query: string) {
  return fetch(`${VITE_BACKEND_URL}/users/${userId}?follow=${query}`, {
    method: "PUT",
    headers: { ...getAuthorizationHeader() },
  });
}

export function getUserConnections(
  userId: string | number,
  query: "followers" | "following"
) {
  return fetch(`${VITE_BACKEND_URL}/users/${userId}/connections?q=${query}`, {
    headers: { ...getAuthorizationHeader() },
  });
}

export function getNotifications() {
  return fetch(`${VITE_BACKEND_URL}/notifications`, {
    headers: { ...getAuthorizationHeader() },
  });
}

function getAuthorizationHeader() {
  const item = getItem();
  if (!item) return window.location.assign("/login");
  return { Authorization: `Bearer ${item.token}` };
}
