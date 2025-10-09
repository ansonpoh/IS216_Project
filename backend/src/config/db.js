import pkg from "pg";
import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
}); 
console.log(process.env.DATABASE_URL)
// tests connection
try {
    const query = `select * from users`;
    let res = await pool.query(query);
    console.log(res.rows)
} catch (err) {
    console.log(err); 
}
// try {
//     const query = `select * from users`;
//     let res = await pool.query(query);
//     console.log(res.rows)
// } catch (err) {
//     console.log(err); 
// }

export default pool;