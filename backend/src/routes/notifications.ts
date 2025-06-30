import { Router } from "express";
import { getNotifications } from "../controllers/notifications";

const router = Router();

router.get("/", getNotifications);

export default router;
