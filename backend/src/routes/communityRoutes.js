import express from "express";
import { create_post_handler, get_all_posts_handler, get_post_likes_handler, user_likes_post_handler, get_all_highlights_handler,create_highlight_handler } from "../controllers/communityController.js";
import multer from "multer";

const upload = multer({storage: multer.memoryStorage()});
const router = express.Router();

router.get("/get_all_posts", get_all_posts_handler);
router.get("/get_post_likes/:userId", get_post_likes_handler);

router.post("/create_post", upload.single("image_file"), create_post_handler);
router.post("/user_likes_post", user_likes_post_handler)

router.get("/get_all_highlights", get_all_highlights_handler);
router.post("/create_highlight", create_highlight_handler);

export default router;

