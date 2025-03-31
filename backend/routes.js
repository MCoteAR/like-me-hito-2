import express from 'express';
import pool from './db.js';

const router = express.Router();

// Obtener todos los posts
router.get('/posts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

// Crear un nuevo post
router.post('/posts', async (req, res) => {
  try {
    const { titulo, img, descripcion } = req.body;
    const likes = 0;
    const query = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [titulo, img, descripcion, likes];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el post' });
  }
});

export default router;
