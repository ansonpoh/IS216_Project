import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

import userRoutes from "./routes/userRoutes.js";
import orgsRoutes from "./routes/orgRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
)

app.listen(3001, async () => {
    console.log(3001)

    // try {
    //     const res = await axios.get("http://localhost:3001/users/get_user_by_id", {params : {id: "b3d7a372-1311-42da-ae22-0edf3a24546e"}})
    //     console.log(res.data);
    // } catch (err) {
    //     console.log(err);
    // }

    // try {
    //     const res = await axios.get("http://localhost:3001/orgs/get_all_orgs")
    //     console.log(res.data);
    // } catch (err) {
    //     console.log(err);
    // }

});

app.use("/users", userRoutes);
app.use("/orgs", orgsRoutes);
app.use("/api/chat", chatRoutes);



