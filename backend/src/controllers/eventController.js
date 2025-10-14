import { get_event_by_id, get_all_categories, get_all_events, get_all_published_events, get_events_of_org } from "../services/eventServices.js";

export async function get_all_events_handler (req, res) {
    try {
        const result = await get_all_events();
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_event_by_id_handler (req, res) {
    try {
        const {event_id} = req.query;
        const result = await get_event_by_id(event_id);
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_categories_handler (req, res) {
    try {
        const result = await get_all_categories();
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_published_events_handler (req, res) {
    try {

    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_events_of_org_handler (req, res) {
    try {
        const {org_id} = req.query;
        const result = await get_events_of_org(org_id);
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}