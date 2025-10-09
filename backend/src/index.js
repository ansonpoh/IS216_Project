import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

import userRoutes from "./routes/userRoutes.js";

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
    try {
        const res = await axios.get("http://localhost:3001/users/get_all_users")
        console.log(res.data);
    } catch (err) {
        console.log(err);
    }
});

app.use("/users", userRoutes);




