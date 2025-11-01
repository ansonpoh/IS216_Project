import pool from "../config/db.js";
import { supabase } from "../config/supabase.js";
import path from "path";

export async function complete_registration(user_id, username, email, profile_image) {
    let profile_image_url;
    try {
        if (profile_image) {
            const fileExt = path.extname(profile_image.originalname);
            const fileName = `${user_id}_${Date.now()}${fileExt}`;

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
        const values = [username, email, user_id, profile_image_url];
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

export async function update_user_info(payload, profile_image_file) {
    try {
        // upload new profile image if provided
        let profile_image_url = null;
        if (profile_image_file) {
            const fileExt = path.extname(profile_image_file.originalname);
            const fileName = `${payload.user_id}_${Date.now()}${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("profile_images")
                .upload(fileName, profile_image_file.buffer, {
                    contentType: profile_image_file.mimetype,
                    upsert: true,
                });

            if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

            const { data: publicData } = supabase.storage
                .from("profile_images")
                .getPublicUrl(fileName);

            profile_image_url = publicData.publicUrl;
        }

        // prepare values (stringify objects/arrays for jsonb columns)
        const skills = payload.skills ? JSON.stringify(payload.skills) : null;
        const languages = payload.languages ? JSON.stringify(payload.languages) : null;
        const availability = payload.availability ? JSON.stringify(payload.availability) : null;
        const contact = payload.contact ? JSON.stringify(payload.contact) : null;
        const emergency = payload.emergency ? JSON.stringify(payload.emergency) : null;

        const values = [
            payload.username || null,
            payload.email || null,
            payload.bio || null,
            payload.date_joined || new Date().toISOString(),
            payload.hours !== undefined ? payload.hours : null,
            payload.user_id,
            profile_image_url || payload.profile_image || null,
            payload.full_name || null,
            skills,
            languages,
            availability,
            payload.availability_start_time || null,
            payload.availability_end_time || null,
            payload.location || null,
            contact,
            payload.contact_phone || null,
            emergency,
            payload.emergency_name || null,
            payload.emergency_relation || null,
            payload.emergency_phone || null,
        ];

        const query = `
            INSERT INTO users (
                username, email, bio, date_joined, hours, user_id, profile_image,
                full_name, skills, languages, availability, availability_start_time,
                availability_end_time, location, contact, contact_phone,
                emergency, emergency_name, emergency_relation, emergency_phone
            ) VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20
            )
            ON CONFLICT (user_id) DO UPDATE SET
                username = EXCLUDED.username,
                email = EXCLUDED.email,
                bio = EXCLUDED.bio,
                date_joined = EXCLUDED.date_joined,
                hours = EXCLUDED.hours,
                profile_image = COALESCE(EXCLUDED.profile_image, users.profile_image),
                full_name = EXCLUDED.full_name,
                skills = EXCLUDED.skills,
                languages = EXCLUDED.languages,
                availability = EXCLUDED.availability,
                availability_start_time = EXCLUDED.availability_start_time,
                availability_end_time = EXCLUDED.availability_end_time,
                location = EXCLUDED.location,
                contact = EXCLUDED.contact,
                contact_phone = EXCLUDED.contact_phone,
                emergency = EXCLUDED.emergency,
                emergency_name = EXCLUDED.emergency_name,
                emergency_relation = EXCLUDED.emergency_relation,
                emergency_phone = EXCLUDED.emergency_phone
            RETURNING *;
        `;

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error("update_user_info error:", err);
        throw err;
    }
}