import { get_event_by_id, get_all_categories, get_all_events, get_all_published_events, get_events_of_org, get_events_by_category, test_inesrt, test_retrieve, get_events_by_region } from "../services/eventServices.js";

export async function test_inesrt_handler(req, res) {
    try {
        const {title, location} = req.body;
        const org_id = "1d7d876d-62ff-476d-80dd-bd3844afd4fe";
        const result = await test_inesrt(org_id, title, location);
        if(result) {
            return res.json({staus: true});
        } else {
            return res.json({status: false});
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function test_retrieve_handler(req,res) {
    try {
        const {title} = req.query;
        const result = await test_retrieve(title);
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}

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

export async function get_events_by_category_handler (req, res) {
    try {
        const {category} = req.query;
        const result = await get_events_by_category(category);
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_events_by_region_handler (req, res) {
    try {
        const {region} = req.query;
        const result = await get_events_by_region(region);
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}