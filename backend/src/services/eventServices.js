import pool from "../config/db.js";

export async function create_event(org_id, title, category, description, location, region, start_date, end_date, start_time, end_time, capacity, hours, status, longitude, latitude) {
    try {
        const query = `insert into events (org_id, title, category, description, location, region, start_date, end_date, start_time, end_time, capacity, hours, longitude, latitude) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;

        const values = [org_id, title, category, description, location, region, start_date, end_date, start_time, end_time, capacity, hours, longitude, latitude];

        const result = await pool.query(query, values);
        return result.rowCount > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_event_by_id(event_id) {
    try {
        const query = `select e.*, o.org_name from events e join organisations o on e.org_id = o.org_id where e.event_id = $1`;
        const values = [event_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_events() {
    try {
        const query = `select e.*, o.org_name, count(er.user_id) as registration_count from events e join organisations o on e.org_id = o.org_id left join event_registration er on e.event_id = er.event_id group by e.event_id, o.org_name`;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }    
}

export async function get_events_by_category(category) {
    try {
        const query = `select e.*, o.org_name from events e join organisations o on e.org_id = o.org_id where category ilike $1`;
        const values = [category];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }    
}

export async function get_events_by_region(region) {
    try {
        const query = `select e.*, o.org_name from events e join organisations o on e.org_id = o.org_id where region ilike $1`;
        const values = [region];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }   
}

export async function get_all_categories() {
    try {
        const query = `select distinct category from events where category is not null order by category`;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_regions() {
    try {
        const query = `select distinct region from events where region is not null order by region`;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_published_events() {
    try {
        const query = `select * from events where is_published=$1`;
        const values = [true];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_events_of_org(org_id) {
    try {
        const query = `select e.*, count(er.user_id) as registration_count from events e left join event_registration er on e.event_id = er.event_id where org_id=$1 group by e.event_id`;
        const values = [org_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_events_by_time(filter, start_date, end_date) {
    try {
        let query;
        if(filter === "weekday") {
            query = `select * from events where extract(isodow from start_date) between 1 and 5`;
        } else if(filter === "weekend") {
            query = `select * from events where extract(isodow from start_date) in (6, 7)`;
        }else if (filter === "range" && start_date && end_date) {
            query = `SELECT * FROM events WHERE start_date BETWEEN $1 AND $2`;
        } else {
            return null;
        }

        const values = filter === "range" ? [start_date, end_date] : [];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_filtered_events(category, region, filter, start_date, end_date) {
    try {
        let conditions = [];
        let values = [];
        let i = 1;
        console.log(category, region, filter)
        if(category) {
            conditions.push(`lower(category) ilike lower($${i++})`)
            values.push(category);
        }
        if(region) {
            conditions.push(`lower(region) ilike lower($${i++})`)
            values.push(region);
        }

        if(filter === "weekday") {
            conditions.push(`extract(isodow from start_date) between 1 and 5`);
        } else if (filter === "weekend") {
            conditions.push(`extract(isodow from start_date) in (6,7)`);
        } else if (filter === "range" && start_date && end_date) {
            conditions.push(`start_date between $${i++} and $${i++}`);
            values.push(start_date, end_date);
        }

        const where_clause = conditions.length > 0 ? `where ${conditions.join(" AND ")}` : "";
        const query = `select * from events ${where_clause}`;
        console.log("Query:", query, "WHERE:", where_clause);
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function delete_event(event_id) {
    try { 
        const query = `delete from events where event_id = $1`;
        const values = [event_id];
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function signup_event(user_id, event_id) {
    try {
        const query = `insert into event_registration (user_id, event_id) values ($1, $2)`;
        const values = [user_id, event_id];
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_registered_users_for_event(event_id) {
    try {
        const query = `select er.*, u.username, u.email from event_registration er join users u on er.user_id = u.user_id where er.event_id = $1`;
        const values = [event_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function check_if_user_signed_up(user_id, event_id) {
    try {
        const query = `select * from event_registration where user_id = $1 and event_id = $2`;
        const values = [user_id, event_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch(err) {
        console.error(err);
        throw err;
    }
}

export async function get_registered_events_for_user(user_id) {
    try {
        const query = `select e1.status, e2.* from event_registration e1 join events e2 on e1.event_id = e2.event_id where e1.user_id = $1`;
        const values = [user_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_selectable_options() {
    try {
        const regions = (await get_all_regions()).map(r => r.region + " region");
        const categories = (await get_all_categories()).map(c => c.category);
        const availability = ["Weekday", "Weekend", "Any Dates"]
        return {regions, categories, availability}
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function update_registration_status(user_id, event_id, status) {
    try {
        const query = `update event_registration set status = $1 where user_id = $2 and event_id = $3 returning *`;
        const values = [status, user_id, event_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}