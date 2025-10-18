import { register_user, check_if_user_email_in_use, get_user_by_id, get_all_users, get_user_by_email, login_user } from "../services/userServices.js";
import util from "util";
import bcrypt from "bcrypt";

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

export async function register_user_handler (req,res) {
    try {
        const {username, email, password} = req.body;
        const email_in_use = await check_if_user_email_in_use(email);
        if(email_in_use) {
            return res.json({status: false})
        }

        const result = await register_user(username, email, password);
        if(result) {
            return res.json({status: true, id: result.id, supabase_id: result.supabase_id });
        } else {
            return res.json({status: false});
        }
        
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function login_user_handler (req, res) {
    try {
        const {email, password} = req.body;
        const result = await login_user(email, password);
        const user = await get_user_by_email(email);

        return res.json({ 
                status: true, 
                token: result.token,
                id: user[0].user_id,
                message: "Login successful",
            });
        // const email_in_use = await check_if_user_email_in_use(email);
        // if(!email_in_use) {
        //     return res.json({status: false, message: "Email not registered!"});
        // }
        
        // const user = await get_user_by_email(email);
        // const data = user[0];
        // const hashed_password = data.password_hash;
        // const user_id = data.user_id;
        // const bcryptCompare = util.promisify(bcrypt.compare);
        // const passwords_match = await bcryptCompare(password, hashed_password);
        // if(passwords_match) {
        //     return res.json({status: true, id: user_id});
        // } else {
        //     return res.json({status: false});
        // }

    } catch (err) {
        console.error(err);
        throw err;
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