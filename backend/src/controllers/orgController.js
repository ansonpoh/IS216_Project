import { register_org, check_if_org_email_in_use, get_org_by_id, get_org_by_email, get_all_orgs } from "../services/orgServices.js";
import util from "util";
import bcrypt from "bcrypt";

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
        const email_in_use = await check_if_org_email_in_use(email);
        if(email_in_use) {
            return res.json({status: false});
        }

        const result = await register_org(org_name, email, password);
        if(result) {
            const org = await get_org_by_email(email);
            const org_id = org[0].org_id;
            return res.json({status: true, id: org_id});
        } else {
            return res.json({status: false});
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function login_org_handler (req, res) {
    try {
        const {email, password} = req.body;
        const email_in_use = await check_if_org_email_in_use(email);
        if(!email_in_use) {
            return res.json({status: false, messsage: "Email not registered"});
        }

        const org = await get_org_by_email(email);
        const data = org[0];
        const hashed_password = data.password_hash;
        const org_id = data.org_id;
        const bcryptCompare = util.promisify(bcrypt.compare);
        const passwords_match = await bcryptCompare(password, hashed_password);
        if(passwords_match) {
            return res.json({status: true, id: org_id});
        } else {
            return res.json({status: false});
        }
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