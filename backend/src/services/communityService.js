import pool from "../config/db.js";
import { supabase } from "../config/supabase.js";
import path from "path";

export async function create_post(supabase_id, subject, body, image) {
    try {
        console.log('create_post - supabase_id:', supabase_id);
        console.log('create_post - subject length:', subject ? subject.length : 0);
        console.log('create_post - has image:', !!image);
        if (image && image.size) console.log('create_post - image size:', image.size, 'type:', image.mimetype);
    const userQuery = `SELECT user_id FROM users WHERE user_id = $1`;
    const userResult = await pool.query(userQuery, [supabase_id]);

        if (!userResult.rows.length) {
            throw new Error(`User not found with supabase_id: ${supabase_id}`);
        }

        const user_id = userResult.rows[0].user_id;

        // Handle image upload if present
        let image_url = null;
        if (image) {
            const fileExt = path.extname(image.originalname);
            const fileName = `${supabase_id}_${Date.now()}${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("feedback_images")
                .upload(fileName, image.buffer, {
                    contentType: image.mimetype,
                    upsert: true,
                });

            if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

            const { data: publicData } = supabase.storage.from("feedback_images").getPublicUrl(fileName);
            image_url = publicData.publicUrl;
        }

        // Create feedback post with correct user_id
        const query = `INSERT INTO feedback (user_id, subject, body, image)
                      VALUES ($1, $2, $3, $4)
                      RETURNING feedback_id, user_id`;
        const values = [user_id, subject, body, image_url];
        const result = await pool.query(query, values);

        return {
            status: true,
            feedback_id: result.rows[0].feedback_id,
            user_id: result.rows[0].user_id,
        };
    } catch (err) {
        console.error("Create post error:", err);
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
        const query = `
            SELECT f.*, u.username, u.profile_image 
            FROM feedback f
            LEFT JOIN users u ON f.user_id = u.user_id
            ORDER BY f.created_at DESC`;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_highlights() {
    try {
        const query = `
            SELECT highlight_id, image, caption 
            FROM highlight 
            ORDER BY highlight_id DESC`;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error getting highlights:', err);
        throw err;
    }
}

export async function create_highlight(image, caption) {
    try {
        const query = `
            INSERT INTO highlight (image, caption)
            VALUES ($1, $2)
            RETURNING highlight_id, image, caption`;
        const values = [image, caption];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error creating highlight:', err);
        throw err;
    }
}