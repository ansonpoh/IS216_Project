import express from "express";
import { check_if_org_email_in_use_handler, complete_registration_handler, get_all_orgs_handler, get_org_by_id_handler, login_org_handler } from "../controllers/orgController.js";
import multer from "multer";

const upload  = multer({storage: multer.memoryStorage()})
const router = express.Router();

router.get("/check_email", check_if_org_email_in_use_handler);
router.get("/get_org_by_id", get_org_by_id_handler);
router.get("/get_all_orgs", get_all_orgs_handler);

router.post("/complete_registration", upload.single("profile_image"), complete_registration_handler);
router.post("/login", login_org_handler);

export default router;