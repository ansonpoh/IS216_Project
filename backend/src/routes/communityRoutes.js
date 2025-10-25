import express from "express";
import { create_post_handler, get_all_posts_handler } from "../controllers/communityController.js";
import multer from "multer";

const upload = multer({storage: multer.memoryStorage()});
const router = express.Router();

router.get("/get_all_posts", get_all_posts_handler);

router.post("/create_post", upload.single("image_file"), create_post_handler);

export default router;

