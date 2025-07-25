import asyncHandler from "express-async-handler";
import { validationResult, param, query } from "express-validator";
import { imageSize } from "image-size";
import { type User } from "@prisma/client";
import { type Request } from "express";
import prisma from "../lib/prisma-client";
import { uploadFile } from "../lib/cloudinary";
import upload from "../lib/multer";

export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = (req.user as User).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
    },
  });

  res.json({ user });
});

export const getUserByUsername = asyncHandler(async (req, res) => {
  const userId = (req.user as User).id;
  const query = (req.query.q || "") as string;
  const users = await prisma.user.findMany({
    where: {
      NOT: { id: userId },
      OR: [
        {
          username: {
            startsWith: `#${query}`,
            mode: "insensitive",
          },
        },
        {
          username: {
            startsWith: query,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      followers: {
        where: {
          id: userId,
        },
        select: {
          username: true,
        },
      },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  res.json({ users });
});

type UserParams = Request["params"] & { userId: number };

export const getUserProfile = [
  param("userId").toInt().isNumeric(),
  asyncHandler<UserParams>(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return void res.sendStatus(404);

    const user1 = (req.user as User).id;
    const { userId: user2 } = req.params;
    const profile = await prisma.user.findUnique({
      where: { id: user2 },
      include: {
        followers: {
          where: {
            id: user1,
          },
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            likes: true,
          },
        },
      },
    });

    if (!profile) return void res.sendStatus(404);
    res.json({ profile });
  }),
];

export const getUserConnections = [
  param("userId").toInt().isNumeric(),
  query("q").custom((value) => value === "followers" || value === "following"),
  asyncHandler<UserParams>(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return void res.sendStatus(404);

    const { userId } = req.params;
    const query = req.query.q as "following" | "followers";
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { [query]: true },
    });

    if (!user) return void res.sendStatus(404);
    res.json({ users: user[query] });
  }),
];

export const updateUserAvatar = [
  upload.single("avatar"),
  param("userId").toInt().isNumeric(),
  asyncHandler<UserParams>(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return void res.sendStatus(404);
    if (!req.file) return void res.status(400).json({ message: "No file" });
    const imageTypes = ["image/jpg", "image/jpeg", "image/png"];
    const fileSize = 3; // 3MB
    const imgSize = 200; // 200px

    const { mimetype, size, buffer } = req.file;

    if (!imageTypes.includes(mimetype)) {
      return void res
        .status(400)
        .json({ message: "File format must be either JPEG or PNG" });
    }

    if (size / (1024 * 1024) > fileSize) {
      return void res.status(400).json({
        message: `File size exceeds the maximum limit of ${fileSize}MB`,
      });
    }

    const { height, width } = imageSize(buffer);
    if (height !== imgSize || width !== imgSize) {
      return void res
        .status(400)
        .json({ message: `Avatar must be ${imgSize} x ${imgSize}` });
    }

    const { userId } = req.params;
    const url = await uploadFile(req.file, `${userId}/avatar`);
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: url },
    });

    res.sendStatus(204);
  }),
];

export const followUser = [
  param("userId").toInt().isNumeric(),
  query("follow").toBoolean().isBoolean(),
  asyncHandler<UserParams>(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.mapped();
      return void res.sendStatus(errors["userId"] ? 404 : 400);
    }

    const user1 = (req.user as User).id;
    const { userId: user2 } = req.params;

    if (req.query.follow === "true") {
      await prisma.user.update({
        where: { id: user1 },
        data: {
          following: {
            connect: {
              id: user2,
            },
          },
        },
      });
      await prisma.notification.create({
        data: {
          type: "FOLLOW",
          senderId: user1,
          recipientId: user2,
        },
      });

      return void res.sendStatus(204);
    }

    await prisma.user.update({
      where: { id: user1 },
      data: {
        following: {
          disconnect: {
            id: user2,
          },
        },
      },
    });

    res.sendStatus(204);
  }),
];
