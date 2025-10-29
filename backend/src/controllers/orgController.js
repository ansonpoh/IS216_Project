import { register_org, login_org, check_if_org_email_in_use, get_org_by_id, get_org_by_email, get_all_orgs, complete_registration } from "../services/orgServices.js";
import {check_if_user_email_in_use} from "../services/userServices.js"


export async function check_if_org_email_in_use_handler (req, res) {
    try {
        const {email} = req.query;
        const result = await check_if_org_email_in_use(email);
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

export async function register_org_handler (req, res) {
    try {
        const {org_name, email, password} = req.body;
        const org_email_in_use = await check_if_org_email_in_use(email);
        const user_email_in_use = await check_if_user_email_in_use(email);
        if(org_email_in_use|| user_email_in_use) {
            return res.json({status: false, message:"Email in use"});
        }

        const result = await register_org(org_name, email, password);
        if(result) {
            return res.json({status: true, id: result.id, supabase_id: result.supabase_id});
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
        const {supabase_id, org_name, email} = req.body;
        const profile_image = req.file;
        const email_in_use = await check_if_user_email_in_use(email);
        if(email_in_use) {
            return res.json({status: false, message:"Email in use"})
        }

        const result = await complete_registration(supabase_id, org_name, email, profile_image);
        return res.json({status: true, user: result});
    } catch (err) {
        console.error(err);
    }
}

export async function login_org_handler (req, res) {
    try {
        const {email, password} = req.body;
        const result = await login_org(email, password);
        const org = await get_org_by_email(email);
        
        if(org.length < 1) {
            return res.json({status: false, message:"Invalid email"})
        } else if(result.status === false) {
            return res.json({status: false, message:"Invalid credentials"})
        }

        return res.json({ 
                status: true, 
                token: result.token,
                id: org[0].org_id,
                message: "Login successful",
            });

    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_org_by_id_handler (req, res) {
    try {
        const {id} = req.query;
        const result = await get_org_by_id(id);
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_all_orgs_handler (req, res) {
    try {
        const result = await get_all_orgs();
        return res.json({result});
    } catch (err) {
        console.error(err);
        throw err;
    }
}