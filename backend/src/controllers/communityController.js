import {
    create_post,
    get_all_posts,
    get_post_likes,
    user_likes_post
} from "../services/communityService.js";

export async function create_post_handler (req, res) {
    try {
        const {user_id, subject, body} = req.body;
        const image = req.file;
        const result = await create_post(user_id, subject, body, image);
        if(result.status) return res.json({status: true});
        return res.json({status:false});
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_posts_handler (req, res) {
    try {
        const result = await get_all_posts();
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_post_likes_handler (req, res) {
    try {
        const {feedback_id} = req.query;
        const result = await get_post_likes(feedback_id);
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function user_likes_post_handler (req, res) {
    try {
        const {feedback_id, user_id} = req.body;
        const result = user_likes_post(feedback_id, user_id);
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}