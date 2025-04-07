import express from 'express';
import pool from './db.js';

const router = express.Router();

// GET /viajes - Obtener todos los viajes
router.get('/viajes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM viajes ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los viajes:", error);
    res.status(500).json({ error: 'Error al obtener los viajes' });
  }
});

// POST /viajes - Crear un nuevo viaje
router.post('/viajes', async (req, res) => {
  try {
    const { destino, presupuesto } = req.body;

    if (!destino || !presupuesto) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const query = `
      INSERT INTO viajes (destino, presupuesto, likes)
      VALUES ($1, $2, 0)
      RETURNING *`;
    const values = [destino, presupuesto];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al crear el viaje:", error);
    res.status(500).json({ error: 'Error al crear el viaje' });
  }
});

// PUT /viajes/:id/like - Dar like a un viaje
router.put('/viajes/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      UPDATE viajes
      SET likes = likes + 1
      WHERE id = $1
      RETURNING *`;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Viaje no encontrado para dar like' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al dar like:", error);
    res.status(500).json({ error: 'Error al dar like al viaje' });
  }
});

// DELETE /viajes/:id - Eliminar un viaje
router.delete('/viajes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount, rows } = await pool.query(
      'DELETE FROM viajes WHERE id = $1 RETURNING *',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Viaje no encontrado para eliminar' });
    }

    res.json({ mensaje: 'Viaje eliminado correctamente', viaje: rows[0] });
  } catch (error) {
    console.error("Error al eliminar el viaje:", error);
    res.status(500).json({ error: 'Error al eliminar el viaje' });
  }
});

export default router;
