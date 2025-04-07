const {
    agregarViaje,
    obtenerViajes,
    modificarPresupuesto,
    eliminarViaje,
    obtenerViaje,
    darLike
} = require('./consultas');

const express = require('express');
const app = express();

app.listen(3000, console.log("SERVIDOR ENCENDIDO"));
app.use(express.json());

const verificarSiExisteElViaje = async (req, res, next) => {
    const { id } = req.params;
    try {
        await obtenerViaje(id);
        next();
    } catch (error) {
        res.status(404).send("No se consiguió ningún viaje con este id");
    }
};

const reportarConsulta = async (req, res, next) => {
    const parametros = req.params;
    const url = req.url;
    console.log(`
    Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url} 
    con los parámetros:
    `, parametros);
    next();
};

// GET todos los viajes
app.get("/viajes", reportarConsulta, async (req, res) => {
    const viajes = await obtenerViajes();
    res.json(viajes);
});

// GET un viaje por id
app.get("/viajes/:id", reportarConsulta, async (req, res) => {
    const { id } = req.params;
    const viaje = await obtenerViaje(id);
    res.json(viaje);
});

// POST para agregar un viaje
app.post("/viajes", reportarConsulta, async (req, res) => {
    try {
        const { destino, presupuesto } = req.body;
        await agregarViaje(destino, presupuesto);
        res.send("Viaje agregado con éxito");
    } catch (error) {
        const { code } = error;
        if (code == "23502") {
            res.status(400).send("Se ha violado la restricción NOT NULL en uno de los campos de la tabla");
        } else {
            res.status(500).send(error);
        }
    }
});

// PUT para modificar presupuesto
app.put("/viajes/:id", reportarConsulta, verificarSiExisteElViaje, async (req, res) => {
    const { id } = req.params;
    const { presupuesto } = req.query;
    await modificarPresupuesto(presupuesto, id);
    res.send("Presupuesto modificado con éxito");
});

// DELETE para eliminar un viaje
app.delete("/viajes/:id", reportarConsulta, verificarSiExisteElViaje, async (req, res) => {
    const { id } = req.params;
    await eliminarViaje(id);
    res.send("Viaje eliminado con éxito");
});

// ✅ NUEVA RUTA: PUT para dar like a un viaje
app.put("/viajes/:id/like", reportarConsulta, verificarSiExisteElViaje, async (req, res) => {
    const { id } = req.params;
    try {
        const viaje = await darLike(id);
        res.json(viaje);
    } catch (error) {
        res.status(error.code || 500).send(error.message || "Error al dar like");
    }
});
