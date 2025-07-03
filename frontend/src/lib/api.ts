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
