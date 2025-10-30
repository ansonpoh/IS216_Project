import {
    create_post,
    get_all_posts,
    get_post_likes,
    user_likes_post,
    create_highlight,
    get_all_highlights
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


export async function get_all_highlights_handler(req, res) {
    try {
        const highlights = await get_all_highlights();
        res.json({
            status: true,
            result: highlights  // Changed from {highlights} to {result: highlights}
        });
    } catch (error) {
        console.error('Error in get_all_highlights_handler:', error);
        res.status(500).json({ 
            status: false,
            message: 'Failed to fetch highlights' 
        });
    }
}

export async function create_highlight_handler(req, res) {
    try {
        const { image, caption } = req.body;
        const highlight = await create_highlight(
            image, caption
        );
        res.json({ 
            status: true,
            result: highlight 
        });
    } catch (error) {
        console.error('Error in create_highlight_handler:', error);
        res.status(500).json({ 
            status: false,
            message: 'Failed to create highlight' 
        });
    }
}