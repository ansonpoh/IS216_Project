import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all feedback posts
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT * FROM feedback 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Get user's liked posts
router.get("/likes/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `SELECT feedback_id FROM feedback_likes WHERE user_id = $1`;
    const result = await pool.query(query, [userId]);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch likes" });
  }
});

// Like a post
router.post("/like", async (req, res) => {
  try {
    const { feedback_id, user_id } = req.body;
    
    // Insert like
    await pool.query(
      `INSERT INTO feedback_likes (feedback_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [feedback_id, user_id]
    );
    
    // Update liked_count
    await pool.query(
      `UPDATE feedback SET liked_count = COALESCE(liked_count, 0) + 1 WHERE feedback_id = $1`,
      [feedback_id]
    );
    
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to like post" });
  }
});

// Unlike a post
router.post("/unlike", async (req, res) => {
  try {
    const { feedback_id, user_id } = req.body;
    
    // Delete like
    await pool.query(
      `DELETE FROM feedback_likes WHERE feedback_id = $1 AND user_id = $2`,
      [feedback_id, user_id]
    );
    
    // Update liked_count
    await pool.query(
      `UPDATE feedback SET liked_count = GREATEST(COALESCE(liked_count, 0) - 1, 0) WHERE feedback_id = $1`,
      [feedback_id]
    );
    
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to unlike post" });
  }
});

export default router;