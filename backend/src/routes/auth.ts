import { Router } from "express";
import * as controllers from "../controllers/auth";

const router = Router();

router.get("/github", controllers.authenticate);
router.get("/github/callback", controllers.login);
router.get("/guest", controllers.guestLogin);
router.delete("/logout", controllers.logout);

export default router;
