import pool from "../config/db.js";

export async function get_all_facts() {
  try {
    const query = `
      SELECT id, fact_text, source, is_active, display_order, created_at
      FROM facts
      WHERE is_active = true
      ORDER BY display_order, created_at;
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error("get_all_facts service error:", err);
    throw err;
  }
}