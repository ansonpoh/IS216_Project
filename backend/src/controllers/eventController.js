import {
  get_event_by_id,
  get_all_categories,
  get_all_events,
  get_all_published_events,
  get_events_of_org,
  get_events_by_category,
  get_events_by_region,
  get_all_regions,
  create_event,
  get_events_by_time,
  get_filtered_events,
  get_selectable_options,
} from "../services/eventServices.js";

export async function create_event_handler (req, res) {
  try {
    const {org_id, title, category, description, location, region, start_date, end_date, start_time, end_time, capacity, hours, status, longitude, latitude} = req.body

    const result = await create_event(org_id, title, category, description, location, region, start_date, end_date, start_time, end_time, capacity, hours, status, longitude, latitude);

    if(result) {
      return res.json({status: true});
    } else {
      return res.json({status: false})
    }

  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function get_all_events_handler(req, res) {
  try {
    const result = await get_all_events();
    return res.json({ result });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function get_event_by_id_handler(req, res) {
  try {
    const { event_id } = req.query;
    const result = await get_event_by_id(event_id);
    return res.json({ result });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function get_all_categories_handler(req, res) {
  try {
    const result = await get_all_categories();
    return res.json({ result });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function get_all_regions_handler(req, res) {
  try {
    const result = await get_all_regions();
    return res.json({ result });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function get_all_published_events_handler(req, res) {
  try {
    const result = await get_all_published_events();
    return res.json({ result });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function get_events_of_org_handler(req, res) {
  try {
    const { org_id } = req.query;
    const result = await get_events_of_org(org_id);
    return res.json({ result });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function get_events_by_category_handler(req, res) {
  try {
    const { category } = req.query;
    const result = await get_events_by_category(category);
    return res.json({ result });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function get_events_by_region_handler(req, res) {
  try {
    const { region } = req.query;
    const result = await get_events_by_region(region);
    return res.json({ result });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function get_events_by_time_handler(req, res) {
  try {
    const {filter, start_date, end_date} = req.query;
    const result = await get_events_by_time(filter, start_date, end_date);
    return res.json({result});
  } catch (err) {
    console.error(err);
    throw err;
  }
} 

export async function get_filtered_events_handler(req, res) {
  try {
    const {category, region, filter, start_date, end_date} = req.query;
    const result = await get_filtered_events(category, region, filter, start_date, end_date);
    return res.json({result});
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function get_selectable_options_handler(req, res) {
  try {
    const result = await get_selectable_options();
    return res.json({result});
  } catch (err) {
    console.error(err);
    throw err;
  }
}