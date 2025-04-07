import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// ✅ Ruta base para test rápido
app.get("/", (req, res) => {
  res.send("Servidor funcionando 👍");
});

// ✅ Rutas principales
app.use('/', routes); // O usa '/api' si prefieres que sea /api/viajes

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

