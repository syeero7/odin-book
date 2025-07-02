import type { FormHTMLAttributes } from "react";

export type AuthUser = {
  id: number;
  username: string;
};

export type FormAction = FormHTMLAttributes<HTMLFormElement>["action"];
