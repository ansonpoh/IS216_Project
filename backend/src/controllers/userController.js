import { register, check_if_email_in_use, get_user_by_id } from "../services/userServices";
import util from "util";
import bcrypt from "bcrypt";

export async function check_if_email_in_use_handler (req, res) {
    try {
        const {email} = req.body;
        const result = await check_if_email_in_use(email);
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

export async function register_handler (req,res) {
    try {
        const {username, email, password, bio} = req.body;
        const result = await register(username, email, password, bio);
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