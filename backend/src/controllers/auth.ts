import asyncHandler from "express-async-handler";
import passport from "passport";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

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
