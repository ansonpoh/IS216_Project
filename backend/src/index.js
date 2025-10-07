import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

app.listen(3001, () => console.log(3001));