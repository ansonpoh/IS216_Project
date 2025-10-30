import pool from "../config/db.js";
import { supabase } from "../config/supabase.js";
import path from "path";

export async function create_post(supabase_id, subject, body, image) {
    try {
        // First get the user_id from users table using supabase_id
        const userQuery = `SELECT user_id FROM users WHERE supabase_id = $1`;
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
            SELECT * FROM highlight 
            ORDER BY highlight_id DESC`;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error getting highlights:', err);
        throw err;
    }
}

export async function create_highlight(image, title, excerpt, author) {
    try {
        const query = `
            INSERT INTO highlight (image, title, excerpt, author)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const values = [image, title, excerpt, author];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error creating highlight:', err);
        throw err;
    }
}