import { check_if_user_email_in_use, get_user_by_id, get_all_users, get_user_by_email, login_user, complete_registration, update_user_info } from "../services/userServices.js";

export async function check_if_user_email_in_use_handler (req, res) {
    try {
        const {email} = req.query;
        const result = await check_if_user_email_in_use(email);
        if(result) {
            return res.json({status: true});
        } else {
            return res.json({status: false});
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function complete_registration_handler(req, res) {
    try {
        const {user_id, username, email} = req.body;
        const profile_image = req.file;

        const result = await complete_registration(user_id, username, email, profile_image);
        return res.json({status: true, user: result});
    } catch (err) {
        console.error(err);
    }
}

export async function login_user_handler (req, res) {
    try {
        const {email, password} = req.body;
        const result = await login_user(email, password);
        const user = await get_user_by_email(email);

        if(user.length < 1) {
            return res.json({status: false, message:"Invalid email"})
        } else if(result.status === false) {
            return res.json({status: false, message:"Invalid credentials"})
        }
        
        return res.json({ 
                status: true, 
                token: result.token,
                id: user[0].user_id,
                message: "Login successful",
            });

    } catch (err) {
        console.error(err);
        return res.json({status: false, message: "Invalid credentials"})
    }
}

export async function get_user_by_id_handler (req, res) {
    try {
        const {id} = req.query;
        const result = await get_user_by_id(id);
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_users_handler (req, res) {
    try {
        const result = await get_all_users();
        return res.json({result});       
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function update_user_info_handler(req, res) {
    try {
        // req.body may contain JSON strings when multipart/form-data is used
        const body = { ...req.body };

        // Try to parse common json fields
        ["skills", "languages", "availability", "contact", "emergency"].forEach((k) => {
            if (body[k] && typeof body[k] === "string") {
                try { body[k] = JSON.parse(body[k]); } catch { /* leave as string */ }
            }
        });

        const profileFile = req.file; // uploaded avatar (multer memory)
        const updated = await update_user_info(body, profileFile);

        return res.json({ status: true, user: updated });
    } catch (err) {
        console.error("update_user_info_handler error:", err);
        return res.status(500).json({ status: false, message: err.message || "Failed to update user" });
    }
}
