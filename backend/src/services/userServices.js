import pool from "../config/db.js";
import bcrypt from "bcrypt";

const salt_rounds = 10;
export async function register(username, email, password, bio) {
    try {
        const salt = await bcrypt.genSalt(salt_rounds);
        const hashed_password = await bcrypt.hash(password, salt);
        const query = `insert into users (username, email, password_hash, bio) values ($1, $2, $3, $4)`;
        const values = [username, email, hashed_password, bio];
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function check_if_email_in_use(email) {
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