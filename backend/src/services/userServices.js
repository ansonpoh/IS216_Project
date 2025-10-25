import pool from "../config/db.js";
import { supabase } from "../config/supabase.js";

export async function register_user(username, email, password) {
    try {
        const {data, error} = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {username},
        })

        if(error) throw new Error(`Supabase error: ${error.message}`);

        const supabase_id = data.user.id;

        const query = `insert into users (username, email, supabase_id) values ($1, $2, $3) returning user_id, username, email, supabase_id`;
        const values = [username, email, supabase_id];
        const result = await pool.query(query, values);
        return {
            status: true,
            id: result.rows[0].user_id,
            supabase_id,
        };

    } catch (err) {
        console.error("Register user error: ", err.mssage);
        return {status: false, error: err.message};
    }
}


export async function login_user(email, password) {
    const {data, error} = await supabase.auth.signInWithPassword({email, password});
    if(error) {
        console.log(error);
        throw error;
    }
    return {token: data.session.access_token, user:data.user};
}

export async function check_if_user_email_in_use(email) {
    try {
        const query = `select * from users where email = $1`;
        const values = [email];
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_user_by_id(id) {
    try {
        const query = `select * from users where user_id = $1`;
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_user_by_email(email) {
    try {
        const query = `select * from users where email = $1`;
        const values = [email];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_users() {
    try {
        const query = `select * from users`;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}