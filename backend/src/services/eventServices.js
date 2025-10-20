import pool from "../config/db.js";

export async function create_event(org_id, title, description, location, capacity, date, start_time, end_time, hours) {
    try {
        const query = `insert into events (org_id, title, description, location, capacity, date, start_time, end_time) values ($1, $2, $3, $4, $5, $6, $7, $8)`;
        const values = [org_id, title, description, location, capacity, date, start_time, end_time];
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function test_inesrt(org_id, title, location) {
    try {
        const query = `insert into events (org_id, title, location) values ($1, $2, $3)`;
        const values = [org_id, title, location];
        const result = await pool.query(query,values);
        return result.rowCount > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function test_retrieve(title) {
    try {
        const query = `select * from events where title = $1`;
        const values = [title];
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

export async function update_event() {
    try {

    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function publish_event() {
    try {

    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_event_by_id(event_id) {
    try {
        const query = `select * from events where event_id = $1`;
        const values = event_id;
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_events() {
    try {
        const query = `select e.*, o.org_name from events e join organisations o on e.org_id = o.org_id`;
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
        const query = `select * from event_categories`;
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
        const query = `select * from events where org_id = $1`;
        const values = [org_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function user_register_for_event(user_id, event_id) {
    try {
        const query = `insert into event_registration (user_id, event_id) values ($1, $2)`;
        const values = [user_id, event_id];
        const result = await pool.query(query, values);
        return result.rows > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function user_withdraw_from_event() {
    try {

    } catch (err) {
        console.error(err);
        throw err;
    }    
}

export async function get_all_registered_users_for_event(event_id) {
    try {
        const query = `select user_id from event_registration where event_id = $1`;
        const values = [event_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}