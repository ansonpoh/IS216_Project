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

        const query = `insert into feedback (user_id, subject, body, image) values ($1, $2, $3, $4)`;
        const values = [user_id, subject, body, image_url];
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