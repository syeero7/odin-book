const { VITE_BACKEND_URL } = import.meta.env;

export function logout() {
  return fetch(`${VITE_BACKEND_URL}/auth/logout`, {
    method: "DELETE",
    credentials: "include",
  });
}

export function getCurrentUser() {
  return fetch(`${VITE_BACKEND_URL}/users/me`, { credentials: "include" });
}

export function getAllPosts() {
  return fetch(`${VITE_BACKEND_URL}/posts`, { credentials: "include" });
}

export function deletePost(postId: string | number) {
  return fetch(`${VITE_BACKEND_URL}/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export function likePost(postId: string | number, like: string) {
  return fetch(`${VITE_BACKEND_URL}/posts/${postId}?like=${like}`, {
    method: "PUT",
    credentials: "include",
  });
}

export function getPostById(postId: string | number) {
  return fetch(`${VITE_BACKEND_URL}/posts/${postId}`, {
    credentials: "include",
  });
}

export function createComment(postId: string | number, body: object) {
  return fetch(`${VITE_BACKEND_URL}/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-type": "application/json" },
    credentials: "include",
  });
}

export function deleteComment(commentId: string | number) {
  return fetch(`${VITE_BACKEND_URL}/posts/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });
}
