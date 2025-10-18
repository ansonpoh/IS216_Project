import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";

const salt_rounds = 10;
export async function register_user(username, email, password) {
    try {
        const salt = await bcrypt.genSalt(salt_rounds);
        const hashed_password = await bcrypt.hash(password, salt);
        const query = `insert into users (username, email, password_hash) values ($1, $2, $3) returning user_id, username, email`;
        const values = [username, email, hashed_password];
        const result = await pool.query(query, values);

        const user_id = result.rows[0].user_id;
        const {data, error} = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {username, local_id: user_id},
        });

        if(error) throw new Error(`Supabase error: ${error}`);

        await pool.query(`UPDATE users SET supabase_id = $1 WHERE user_id = $2`, [data.user.id, user_id])

        return { id: user_id, supabase_id: data.user.id };
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function login_user(email, password) {
    const {data, error} = await supabase.auth.signInWithPassword({email, password});
    if(error) throw new Error(error);
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