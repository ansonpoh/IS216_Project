import { supabase } from "./supabase.js";

export const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.json({status: false, error: "Missing Auth Header"});

    const token = authHeader.replace("Bearer ", "");

    const {data, error} = await supabase.auth.getUser(token);
    if(error || !data.user) return res.json({status: false, error: "Invalid or expired token"});

    req.user = data.user;
    next();
}