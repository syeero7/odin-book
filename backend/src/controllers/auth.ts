import asyncHandler from "express-async-handler";
import passport from "passport";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma-client";

export const authenticate = passport.authenticate("github", {
  session: false,
  scope: ["user:email"],
});

const { JWT_SECRET, GUEST_USERNAME, FRONTEND_URL } = process.env;

export const login = [
  passport.authenticate("github", { session: false }),
  asyncHandler(async (req, res) => {
    const token = jwt.sign({ id: (req.user as User).id }, JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  }),
];

export const guestLogin = asyncHandler(async (_req, res) => {
  const guest = await prisma.user.findUnique({
    where: { username: GUEST_USERNAME! },
  });
  if (!guest) throw new Error("Guest not found");
  const token = jwt.sign({ id: guest.id }, JWT_SECRET!, { expiresIn: "1d" });

  res.redirect(`${FRONTEND_URL}/login?token=${token}`);
});
