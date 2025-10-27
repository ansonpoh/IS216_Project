import express from "express";
import { check_if_user_email_in_use_handler, get_all_users_handler, get_user_by_id_handler, login_user_handler, register_user_handler } from "../controllers/userController.js";
import multer from "multer";

const upload  = multer({storage: multer.memoryStorage()})
const router = express.Router();

router.get("/check_email", check_if_user_email_in_use_handler);
router.get("/get_all_users", get_all_users_handler);
router.get("/get_user_by_id", get_user_by_id_handler);

router.post("/register", upload.single("profile_image"), register_user_handler);
router.post("/login", login_user_handler);

export default router;