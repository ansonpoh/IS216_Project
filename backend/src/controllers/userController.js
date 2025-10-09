import { register_user, check_if_user_email_in_use, get_user_by_id, get_all_users, get_user_by_email } from "../services/userServices.js";
import util from "util";
import bcrypt from "bcrypt";

export async function check_if_user_email_in_use_handler (req, res) {
    try {
        const {email} = req.body;
        const result = await check_if_user_email_in_use(email);
        if(result) {
            return res.json({message: true});
        } else {
            return res.json({message: false});
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function register_user_handler (req,res) {
    try {
        const {username, email, password, bio} = req.body;
        const result = await register_user(username, email, password, bio);
        if(result) {
            return res.json({message: "success"});
        } else {
            return res.json({message: "failed"});
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function login_handler (req, res) {
    try {
        const {email, password} = req.body;
        const email_in_use = await check_if_user_email_in_use(email);
        if(!email_in_use) {
            return res.json({message: "Email not registered!"});
        }
        
        const user_data = await get_user_by_email(email);

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