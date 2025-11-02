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
        // Log incoming request for easier debugging
        console.log('create_post_handler - req.body keys:', Object.keys(req.body));
        console.log('create_post_handler - req.file present:', !!req.file);

        const {user_id, subject, body} = req.body;
        const image = req.file;

        if (!user_id) {
            console.warn('create_post_handler - missing user_id in request body');
            return res.status(400).json({ status: false, message: 'Missing user_id' });
        }

        const result = await create_post(user_id, subject, body, image);
        if (result && result.status) return res.json({ status: true, result });
        return res.status(500).json({ status: false, message: 'Failed to create post' });
    } catch (err) {
        console.error('create_post_handler error:', err);
        // Return error message to client for easier troubleshooting (remove in production)
        return res.status(500).json({ status: false, message: err.message || 'Internal server error' });
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