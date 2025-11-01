import {
    get_all_facts
} from "../services/landingPageServices.js";

export async function get_all_facts_handler(req, res) {
  try {
    const result = await get_all_facts();
    return res.status(200).json({ facts: result });
  } catch (err) {
    console.error("get_all_facts_handler error:", err);
    return res.status(500).json({ error: "Failed to fetch facts" });
  }
}