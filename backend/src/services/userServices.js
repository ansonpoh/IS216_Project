import pool from "../config/db.js";
import { supabase } from "../config/supabase.js";
import path from "path";

export async function complete_registration(supabase_id, username, email, profile_image) {
    let profile_image_url;
    try {
        if (profile_image) {
            const fileExt = path.extname(profile_image.originalname);
            const fileName = `${supabase_id}_${Date.now()}${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("profile_images") // bucket name
                .upload(fileName, profile_image.buffer, {
                contentType: profile_image.mimetype,
                upsert: true,
                });

            if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

            const { data: publicData } = supabase.storage
                .from("profile_images")
                .getPublicUrl(fileName);

            profile_image_url = publicData.publicUrl;
        } 

        const query = `insert into users (username, email, user_id, profile_image) values ($1, $2, $3, $4) returning user_id, username, email`;
        const values = [username, email, supabase_id, profile_image_url];
        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (err) {
        console.log(err);
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