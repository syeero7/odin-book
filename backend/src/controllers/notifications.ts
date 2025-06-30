import asyncHandler from "express-async-handler";
import { type User } from "@prisma/client";
import prisma from "../lib/prisma-client";

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = (req.user as User).id;
  const notifications = await prisma.notification.findMany({
    where: { recipientId: userId },
    include: {
      sender: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ notifications });
});
