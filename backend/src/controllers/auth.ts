import asyncHandler from "express-async-handler";
import passport from "passport";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma-client";

export const authenticate = passport.authenticate("github", {
  session: false,
  scope: ["user:email"],
});

export const login = [
  passport.authenticate("github", { session: false }),
  asyncHandler(async (req, res) => {
    const token = jwt.sign(
      { id: (req.user as User).id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({ token });
  }),
];

export const guestLogin = asyncHandler(async (_req, res) => {
  const { GUEST_USERNAME, JWT_SECRET } = process.env;
  const guest = await prisma.user.findUnique({
    where: { username: GUEST_USERNAME! },
  });
  const token = jwt.sign({ id: guest?.id }, JWT_SECRET!, { expiresIn: "1d" });

  res.json({ token });
});
