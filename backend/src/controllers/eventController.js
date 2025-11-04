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
  signup_event,
  check_if_user_signed_up,
  get_registered_events_for_user,
  get_all_registered_users_for_event,
  update_registration_status,
  update_publish_status,
} from "../services/eventServices.js";
import axios from "axios";

export async function create_event_handler (req, res) {
  try {
    const {org_id, title, category, description, location, region, start_date, end_date, start_time, end_time, capacity, hours, longitude, latitude} = req.body

    const result = await create_event(org_id, title, category, description, location, region, start_date, end_date, start_time, end_time, capacity, hours, longitude, latitude);

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

export async function event_data_modify_handler(req, res) {
  try {
        let key = process.env.GOOGLE_MAPS_API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
        if (typeof key === 'string') {
            key = key.replace(/^\s*"|"\s*$/g, '').trim();
        }

        const {events} = req.body;
        if(events.length < 1) return res.json({events: []});

        const geocodeUrl = (postal) => `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(postal)}&components=country:SG&key=${key}`;

        const promises = events.map(async (e) => {
          const postal = e.location;
          try {
            const geoRes = await axios.get(geocodeUrl(postal));
            if(geoRes.data && geoRes.data.status === "OK" && geoRes.data.results && geoRes.data.results.length) {
              const loc = geoRes.data.results[0].geometry.location;
              return {
                title: e.title,
                postalcode: postal,
                region: e.region,
                category: e.category,
                organization: e.organization,
                description: e.description,
                event_id: e.event_id,
                lat: loc.lat,
                lng: loc.lng,
                date: e.date,
                time: e.time,
                image_url: e.image_url,
              }
            }
          } catch (err) {
            console.error(err);
            throw err;
          }
        })

        const results = await Promise.all(promises);
        return res.json(results.filter(Boolean));
        
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function signup_event_handler(req, res) {
  try {
    const {user_id, event_id} = req.body;
    const result = await signup_event(user_id, event_id);
    return res.json({result});
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function check_if_user_signed_up_handler(req,res) {
  try {
    const {user_id, event_id} = req.query;
    const result = await check_if_user_signed_up(user_id, event_id);
    return res.json({result});
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function get_registered_events_for_user_handler(req, res) {
  try {
    const {user_id} = req.query;
    const result = await get_registered_events_for_user(user_id);
    return res.json({result});
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function get_registered_users_for_event_handler(req,res) {
  try {
    const {event_id} = req.query;
    const result = await get_all_registered_users_for_event(event_id);
    return res.json({result});
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function update_registration_status_handler(req, res) {
  try {
    const {user_id, event_id, status} = req.body;
    const result = await update_registration_status(user_id, event_id, status);
    return res.json({result});
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function update_publish_status_handler(req, res) {
  try {
    const {event_id, status} = req.body;
    const result = await update_publish_status(event_id, status);
    return res.json({result});
  } catch (err) {
    console.error(err);
    throw err;
  }
}