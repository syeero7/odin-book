import { type AuthUser } from "../types";

const STORAGE: "localStorage" | "sessionStorage" = "sessionStorage";
const STORAGE_KEY = "USER";

export const getItem = (): AuthUser | null => {
  try {
    const user = window[STORAGE].getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const setItem = (user: AuthUser) => {
  try {
    window[STORAGE].setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error(error);
  }
};

export const removeItem = () => {
  try {
    window[STORAGE].removeItem(STORAGE_KEY);
  } catch (error) {
    console.log(error);
  }
};
