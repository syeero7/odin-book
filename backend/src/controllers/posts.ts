import { validationResult, body, param, query, oneOf } from "express-validator";
import asyncHandler from "express-async-handler";
import { imageSize } from "image-size";
import { type Request } from "express";
import type { User, Prisma } from "@prisma/client";
import prisma from "../lib/prisma-client";
import upload from "../lib/multer";
import { uploadFile, deleteFile } from "../lib/cloudinary";

export const getAllPosts = asyncHandler(async (req, res) => {
  const userId = (req.user as User).id;
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: { where: { userId } },
    },
  });

  res.json({ posts });
});

type UserPostParams = Request["params"] & {
  userId: number;
  postId: number;
  commentId: number;
};

export const getPostById = [
  param("postId").toInt().isNumeric(),
  asyncHandler<UserPostParams>(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return void res.sendStatus(404);

    const userId = (req.user as User).id;
    const { postId } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                username: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: { where: { userId } },
      },
    });

    if (!post) return void res.sendStatus(404);
    res.json({ post });
  }),
];

export const getUserPosts = [
  param("userId").toInt().isNumeric(),
  query("liked").optional().toBoolean().isBoolean(),
  asyncHandler<UserPostParams>(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.mapped();
      return void res.sendStatus(errors["userId"] ? 404 : 400);
    }

    const currentUserId = (req.user as User).id;
    const { userId } = req.params;
    if (req.query.liked === "true") {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          likes: {
            some: {
              userId,
            },
          },
        },
        include: {
          author: {
            select: {
              username: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          likes: {
            where: {
              userId: currentUserId,
            },
          },
        },
      });

      return void res.json({ posts });
    }

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      where: { authorId: userId },
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          where: {
            userId: currentUserId,
          },
        },
      },
    });

    res.json({ posts });
  }),
];

export const createPost = [
  upload.single("image"),
  body("title")
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage("Post must be within 80 characters"),
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Post must be within 1000 characters"),
  query("text").optional().toBoolean().isBoolean(),
  query("image").optional().toBoolean().isBoolean(),
  oneOf([query("text").exists(), query("image").exists()]),
  asyncHandler<UserPostParams>(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.formatWith(({ msg }) => msg).mapped();
      if (errors["text"] || errors["image"]) return void res.sendStatus(400);
      return void res.status(400).json({ errors });
    }

    const userId = (req.user as User).id;
    const { text, image } = req.query;
    const { title, content } = req.body;

    const data: Prisma.PostCreateInput = {
      title,
      author: {
        connect: {
          id: userId,
        },
      },
    };

    if (text === "true") data.content = content;
    if (image === "true") {
      if (!req.file) return void res.status(400).json({ message: "No file" });
      const imageTypes = ["image/jpg", "image/jpeg", "image/png"];
      const fileSize = 5; // 5MB
      const imgSize = 1200; // 1200px

      const { mimetype, size, buffer } = req.file!;

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
      if (height > imgSize || width > imgSize) {
        return void res
          .status(400)
          .json({ message: `Image must be less than ${imgSize} x ${imgSize}` });
      }

      const uniqueSuffix = `${userId}-${Date.now().toString(36)}`;
      const url = await uploadFile(req.file, `posts/${uniqueSuffix}`);

      data.imageUrl = url;
    }

    await prisma.post.create({ data });
    res.sendStatus(201);
  }),
];

export const createComment = [
  param("postId").toInt().isNumeric(),
  body("content")
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage("Comment must be within 300 characters"),
  asyncHandler<UserPostParams>(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.formatWith(({ msg }) => msg).mapped();
      if (errors["postId"]) return void res.sendStatus(404);
      return void res.status(400).json({ errors });
    }

    const userId = (req.user as User).id;
    const { postId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content,
        post: {
          connect: { id: postId },
        },
        user: {
          connect: { id: userId },
        },
      },
      include: {
        post: {
          select: { authorId: true },
        },
      },
    });

    const { authorId } = comment.post;
    if (authorId !== userId) {
      await prisma.notification.create({
        data: {
          type: "COMMENT",
          postId,
          senderId: userId,
          recipientId: authorId,
        },
      });
    }

    res.sendStatus(201);
  }),
];

export const likePost = [
  param("postId").toInt().isNumeric(),
  query("like").toBoolean().isBoolean(),
  asyncHandler<UserPostParams>(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.mapped();
      return void res.sendStatus(errors["postId"] ? 404 : 400);
    }

    const { postId } = req.params;
    const userId = (req.user as User).id;

    if (req.query.like === "true") {
      const like = await prisma.like.create({
        data: { userId, postId },
        include: {
          post: {
            select: { authorId: true },
          },
        },
      });

      const { authorId } = like.post;
      if (authorId === userId) return void res.sendStatus(204);

      await prisma.notification.create({
        data: {
          type: "LIKE",
          postId,
          senderId: userId,
          recipientId: authorId,
        },
      });

      return void res.sendStatus(204);
    }

    await prisma.$transaction([
      prisma.like.delete({
        where: {
          postId_userId: { postId, userId },
        },
      }),
      prisma.notification.deleteMany({
        where: {
          type: "LIKE",
          postId,
          senderId: userId,
        },
      }),
    ]);

    res.sendStatus(204);
  }),
];

export const deletePost = [
  param("postId").toInt().isNumeric(),
  asyncHandler<UserPostParams>(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return void res.sendStatus(404);

    const { postId } = req.params;
    await prisma.post.delete({ where: { id: postId } });
    await deleteFile(`posts/${postId}`);

    res.sendStatus(204);
  }),
];

export const deleteComment = [
  param("commentId").toInt().isNumeric(),
  asyncHandler<UserPostParams>(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return void res.sendStatus(404);

    const { commentId } = req.params;
    await prisma.comment.delete({ where: { id: commentId } });

    res.sendStatus(204);
  }),
];
