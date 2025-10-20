import pool from "../config/db.js";
import { supabase } from "../config/supabase.js";

export async function register_org(org_name, email, password) {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { org_name },
    });

    if (error) throw new Error(`Supabase error: ${error.message}`);

    const supabase_id = data.user.id;

    const query = `
      INSERT INTO organisations (org_name, email, supabase_id)
      VALUES ($1, $2, $3)
      RETURNING org_id, org_name, email, supabase_id
    `;
    const values = [org_name, email, supabase_id];
    const result = await pool.query(query, values);

    return {
      status: true,
      id: result.rows[0].org_id,
      supabase_id,
    };
  } catch (err) {
    console.error("Register org error:", err.message);
    return { status: false, error: err.message };
  }
}

export async function login_org(email, password) {
    const {data, error} = await supabase.auth.signInWithPassword({email, password});
    if(error) {
        console.log(error);
        return {status: false}
    };
    return {token: data.session.access_token, org:data.user};
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