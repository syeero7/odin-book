import { Router } from "express";
import * as controllers from "../controllers/auth";

const router = Router();

router.get("/github", controllers.authenticate);
router.get("/github/callback", controllers.login);

export default router;
