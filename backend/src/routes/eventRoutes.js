import express from "express";
<<<<<<< HEAD
import { get_all_categories_handler, get_all_events_handler, get_event_by_id_handler, get_events_by_category_handler, get_events_of_org_handler, test_insert_handler, test_retrieve_handler } from "../controllers/eventController.js";
=======
import { get_all_categories_handler, get_all_events_handler, get_event_by_id_handler, get_events_by_category_handler, get_events_by_region_handler, get_events_of_org_handler } from "../controllers/eventController.js";
>>>>>>> fa0a33d01622f3328239b12735683a196cab0f9e
import { requireAuth } from "../config/auth.js";

const router = express.Router();

router.get("/get_all_categories", get_all_categories_handler);
router.get("/get_all_events", get_all_events_handler);
router.get("/get_event_by_id", get_event_by_id_handler);
router.get("/get_events_of_org", get_events_of_org_handler);
router.get("/get_events_by_category", get_events_by_category_handler);
router.get("/get_events_by_region", get_events_by_region_handler);

<<<<<<< HEAD
router.get("/test_retreive", test_retrieve_handler);
router.post("/test_insert", test_insert_handler);
export default router;

=======
export default router;
>>>>>>> fa0a33d01622f3328239b12735683a196cab0f9e
