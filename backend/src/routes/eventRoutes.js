import express from "express";
import { get_all_categories_handler, get_all_events_handler, get_event_by_id_handler, get_events_by_category_handler, get_events_by_region_handler, get_events_of_org_handler, get_all_regions_handler, create_event_handler, get_events_by_time_handler, get_filtered_events_handler, get_selectable_options_handler, event_data_modify_handler, signup_event_handler, check_if_user_signed_up_handler, get_registered_events_for_user_handler, get_registered_users_for_event_handler, update_registration_status_handler, get_all_published_events_handler } from "../controllers/eventController.js";
import { requireAuth } from "../config/auth.js";

const router = express.Router();

router.get("/get_all_categories", get_all_categories_handler);
router.get("/get_all_events", get_all_events_handler);
router.get("/get_all_published_events", get_all_published_events_handler);
router.get("/get_event_by_id", get_event_by_id_handler);
router.get("/get_events_of_org", get_events_of_org_handler);
router.get("/get_events_by_category", get_events_by_category_handler);
router.get("/get_events_by_region", get_events_by_region_handler);
router.get("/get_all_regions", get_all_regions_handler);
router.get("/get_events_by_time", get_events_by_time_handler);
router.get("/get_filtered_events", get_filtered_events_handler);
router.get("/get_selectable_options", get_selectable_options_handler);
router.get("/check_if_user_signed_up", check_if_user_signed_up_handler);
router.get("/get_registered_events_for_user", get_registered_events_for_user_handler);
router.get("/get_registered_users_for_event", get_registered_users_for_event_handler);

router.post("/create_event", create_event_handler);
router.post("/event_data_modify", event_data_modify_handler);
router.post("/signup_event", signup_event_handler);
router.post("/update_registration_status", update_registration_status_handler);

export default router;
