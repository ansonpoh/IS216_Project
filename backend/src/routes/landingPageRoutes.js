import express from "express";
import { get_all_facts_handler } from "../controllers/landingPageController.js";

const router = express.Router();

router.get("/facts", get_all_facts_handler);

export default router;