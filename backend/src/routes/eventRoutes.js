import express from "express";
import { get_all_categories_handler, get_all_events_handler, get_event_by_id_handler, get_events_by_category_handler, get_events_of_org_handler, test_insert_handler, test_retrieve_handler } from "../controllers/eventController.js";
import { requireAuth } from "../config/auth.js";

const router = express.Router();

router.get("/get_all_categories", get_all_categories_handler);
router.get("/get_all_events", get_all_events_handler);
router.get("/get_event_by_id", get_event_by_id_handler);
router.get("/get_events_of_org", get_events_of_org_handler);
router.get("/get_events_by_category", get_events_by_category_handler);

router.get("/test_retreive", test_retrieve_handler);
router.post("/test_insert", test_insert_handler);
export default router;

