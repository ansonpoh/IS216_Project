import express from "express";
import { check_if_user_email_in_use_handler, get_all_users_handler, register_user_handler } from "../controllers/userController.js";

const router = express.Router();

router.post("/check_email", check_if_user_email_in_use_handler);
router.post("/register", register_user_handler);
router.get("/get_all_users", get_all_users_handler);

export default router;