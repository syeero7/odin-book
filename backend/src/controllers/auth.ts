import asyncHandler from "express-async-handler";
import { type CookieOptions } from "express";
import passport from "passport";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma-client";

export const authenticate = passport.authenticate("github", {
  session: false,
  scope: ["user:email"],
});

const { COOKIE_NAME, JWT_SECRET, GUEST_USERNAME, FRONTEND_URL, NODE_ENV } =
  process.env;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

export const login = [
  passport.authenticate("github", { session: false }),
  asyncHandler(async (req, res) => {
    const token = jwt.sign({ id: (req.user as User).id }, JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.cookie(COOKIE_NAME!, token, cookieOptions);
    res.redirect(`${FRONTEND_URL}/login?success=true`);
  }),
];

export const guestLogin = asyncHandler(async (_req, res) => {
  const guest = await prisma.user.findUnique({
    where: { username: GUEST_USERNAME! },
  });
  if (!guest) throw new Error("Guest not found");
  const token = jwt.sign({ id: guest.id }, JWT_SECRET!, { expiresIn: "1d" });

  res.cookie(COOKIE_NAME!, token, cookieOptions);
  res.redirect(`${FRONTEND_URL}/login?success=true`);
});

export const logout = asyncHandler(async (_req, res) => {
  res.cookie(COOKIE_NAME!, "", { ...cookieOptions, maxAge: 0 });
  res.sendStatus(204);
});
