import pool from "../config/db.js";
import bcrypt from "bcrypt";

const salt_rounds = 10;
export async function register_org(org_name, email, password) {
    try {
        const salt = await bcrypt.genSalt(salt_rounds);
        const hashed_password = await bcrypt.hash(password, salt);
        const query = `insert into organisations (org_name, email, password_hash) values ($1, $2, $3)`;
        const values = [org_name, email, hashed_password];
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function check_if_org_email_in_use(email) {
    try {
        const query = `select * from organisations where email = $1`;
        const values = [email];
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_org_by_id(id) {
    try {
        const query = `select * from organisations where org_id = $1`;
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_org_by_email(email) {
    try {
        const query = `select * from organisations where email = $1`;
        const values = [email];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_orgs() {
    try {
        const query = `select * from organisations`;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}