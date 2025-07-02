import { Router } from "express";
import * as controllers from "../controllers/users";

const router = Router();

router.get("/me", controllers.getCurrentUser);
router.get("/search", controllers.getUserByUsername);
router.get("/:userId/profile", controllers.getUserProfile);
router.get("/:userId/followers", controllers.getUserFollowers);
router.get("/:userId/following", controllers.getUserFollowing);
router.put("/avatar", controllers.updateUserAvatar);
router.put("/:userId", controllers.followUser); // follow=true

export default router;
