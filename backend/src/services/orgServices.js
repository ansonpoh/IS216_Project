import pool from "../config/db.js";
import { supabase } from "../config/supabase.js";

export async function complete_registration(org_id, org_name, email, profile_image) {
    let profile_image_url;
    try {
        if (profile_image) {
            const fileExt = path.extname(profile_image.originalname);
            const fileName = `${org_id}_${Date.now()}${fileExt}`;

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

        const query = `insert into organisations (org_name, email, org_id, profile_image) values ($1, $2, $3, $4) returning org_id, org_name, email`;
        const values = [org_name, email, org_id, profile_image_url];
        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (err) {
        console.log(err);
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