import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import prisma from "./lib/prisma-client";
import { User } from "@prisma/client";
import routes from "./routes/";

const server = express();

const {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  BACKEND_URL,
  FRONTED_URL,
  GUEST_USERNAME,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} = process.env;

server.use(
  cors({
    origin: (origin, cb) => {
      if (NODE_ENV === "development" || origin === FRONTED_URL) {
        cb(null, true);
        return;
      }

      cb(new Error("Not allowed by CORS"));
    },
  })
);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET!,
      callbackURL: `${BACKEND_URL!}/auth/github/callback`,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: { id: string; username: string; photos: { value: string }[] },
      done: (error: unknown, user?: User) => void
    ) => {
      try {
        let user = await prisma.user.findUnique({
          where: { githubId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              githubId: profile.id,
              username: profile.username,
              avatarUrl:
                profile.photos[0]?.value ||
                `https://api.dicebear.com/9.x/${"bottts-neutral"}/svg?seed=${
                  profile.id
                }&size=${200}&radius=50`,
            },
          });
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

server.use("/auth", routes.auth);
server.use(async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return void res.sendStatus(401);

    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET!) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    req.user = user || undefined;

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return void res.redirect(`${BACKEND_URL}/auth/github`);
    }

    next(error);
  }
});
server.use((req, res, next) => {
  if ((req.user as User).username === GUEST_USERNAME && req.method === "DELETE")
    return void res.sendStatus(403);

  next();
});
server.use("/users", routes.users);
server.use("/posts", routes.posts);
server.use("/notifications", routes.notifications);

server.use(((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: error.message || "Server error" });
}) as ErrorRequestHandler);

server.listen(PORT!, () => {
  console.log(`🚀 http://localhost:${PORT!}`);
});
