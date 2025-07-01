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
    const { id, username } = req.user as User;
    const token = jwt.sign({ id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.json({ token, id, username });
  }),
];

export const guestLogin = asyncHandler(async (_req, res) => {
  const { GUEST_USERNAME, JWT_SECRET } = process.env;
  const guest = await prisma.user.findUnique({
    where: { username: GUEST_USERNAME! },
  });
  if (!guest) throw new Error("Guest not found");
  const { id, username } = guest;
  const token = jwt.sign({ id }, JWT_SECRET!, { expiresIn: "1d" });

  res.json({ token, id, username });
});
