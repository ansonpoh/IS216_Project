import pool from "../config/db.js";
import bcrypt from "bcrypt";

const salt_rounds = 10;
export async function register_user(username, email, password) {
    try {
        const salt = await bcrypt.genSalt(salt_rounds);
        const hashed_password = await bcrypt.hash(password, salt);
        const query = `insert into users (username, email, password_hash) values ($1, $2, $3)`;
        const values = [username, email, hashed_password];
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
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