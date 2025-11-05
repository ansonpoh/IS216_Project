import express from "express";
import { check_if_user_email_in_use_handler, complete_registration_handler, get_all_users_handler, get_user_by_id_handler, login_user_handler, update_user_info_handler } from "../controllers/userController.js";
import multer from "multer";

const upload  = multer({storage: multer.memoryStorage()})
const router = express.Router();

router.get("/check_email", check_if_user_email_in_use_handler);
router.get("/get_all_users", get_all_users_handler);
router.get("/get_user_by_id", get_user_by_id_handler);

router.post("/complete_registration", upload.none(), complete_registration_handler);
router.post("/login", login_user_handler);

router.post("/update_profile", upload.single("avatar"), update_user_info_handler);

export default router;