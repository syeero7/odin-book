import { Router } from "express";
import * as controllers from "../controllers/posts";

const router = Router();

router.get("/", controllers.getAllPosts);
router.get("/:postId", controllers.getPostById);
router.get("/users/:userId", controllers.getUserPosts); // ?liked=true
router.post("/", controllers.createPost); // ?type=text ?type=image
router.post("/:postId/comments", controllers.createComment);
router.put("/:postId", controllers.likePost); // ?like=true
router.delete("/:postId", controllers.deletePost);
router.delete("/comments/:commentId", controllers.deleteComment);

export default router;
