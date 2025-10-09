import pool from "../config/db.js";
import bcrypt from "bcrypt";

const salt_rounds = 10;
export async function register_user(user_id, username, email, password, bio) {
    try {
        const salt = await bcrypt.genSalt(salt_rounds);
        const hashed_password = await bcrypt.hash(password, salt);
        const query = `insert into users (user_id, username, email, password_hash, bio) values ($1, $2, $3, $4, $5, $6)`;
        const values = [user_id, username, email, hashed_password, bio, 0];
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