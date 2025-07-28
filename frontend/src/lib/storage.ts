const STORAGE: "localStorage" | "sessionStorage" = "sessionStorage";
const STORAGE_KEY = "TOKEN";

export const getItem = (): { token: string } | null => {
  try {
    const user = window[STORAGE].getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const setItem = (token: { token: string }) => {
  try {
    window[STORAGE].setItem(STORAGE_KEY, JSON.stringify(token));
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
