import express from "express";
import { check_if_email_in_use_handler, register_handler } from "../controllers/userController";

const router = express.Router();

router.post("/check_email", check_if_email_in_use_handler);
router.post("/register", register_handler);

export default router;