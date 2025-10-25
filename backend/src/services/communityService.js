import pool from "../config/db.js";
import { supabase } from "../config/supabase.js";
import path from "path";

export async function create_post(user_id, subject, body, image) {
    try {

        let image_url = null;
        if(image) {
            const fileExt = path.extname(image.originalname);
            const fileName = `${user_id}_${Date.now()}${fileExt}`;

            const {error: uploadError} = await supabase.storage
                .from("feedback_images")
                .upload(fileName, image.buffer, {
                    contentType: image.mimetype,
                    upsert: true,
                })

            if(uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

            const {data: publicData} = supabase.storage.from("feedback_images").getPublicUrl(fileName);

            image_url = publicData.publicUrl;
        }

        const query = `insert into feedback (user_id, subject, body, image) values ($1, $2, $3, $4) returning feedback_id, user_id`;
        const values = [user_id, subject, body, image_url];
        const result = await pool.query(query, values);
        return {
            status: true,
            feedback_id: result.rows[0].feedback_id,
            user_id: result.rows[0].user_id,
        };
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_post_likes(feedback_id) {
    try {
        const query = `select count(user_id) from feedback_likes where feedback_id = $1`;
        const values = [feedback_id];
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function user_likes_post(feedback_id, user_id) {
    try {
        const query = `insert into feedback_likes (feedback_id, user_id) values ($1, $2)`;
        const values = [feedback_id, user_id];
        const result = await pool.query(query, values); 
        return result.rowCount > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_posts() {
    try {
        const query = `select * from feedback`;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}