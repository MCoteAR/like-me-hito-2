const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'plan_de_viajes',
    allowExitOnIdle: true
})

const agregarViaje = async (destino, presupuesto) => {
    const consulta = "INSERT INTO viajes VALUES (DEFAULT, $1, $2, 0)" // 0 likes por defecto
    const values = [destino, presupuesto]
    await pool.query(consulta, values)
    console.log("Viaje agregado")
}

const obtenerViajes = async () => {
    const result = await pool.query("SELECT * FROM viajes")
    return result.rows
}

const modificarPresupuesto = async (presupuesto, id) => {
    const consulta = "UPDATE viajes SET presupuesto = $1 WHERE id = $2"
    const values = [presupuesto, id]
    const { rowCount } = await pool.query(consulta, values)
    if (rowCount === 0) {
        throw { code: 404, message: "No se consiguió ningún viaje con este id" }
    }
}

const eliminarViaje = async (id) => {
    const consulta = "DELETE FROM viajes WHERE id = $1"
    const values = [id]
    const { rowCount } = await pool.query(consulta, values)
    if (rowCount === 0) {
        throw { code: 404, message: "No se encontró el viaje a eliminar" }
    }
}

const obtenerViaje = async (id) => {
    const consulta = "SELECT * FROM viajes WHERE id = $1"
    const values = [id]
    const result = await pool.query(consulta, values)
    return result.rows[0]
}

// ✅ Nueva función para dar like
const darLike = async (id) => {
    const consulta = "UPDATE viajes SET likes = likes + 1 WHERE id = $1 RETURNING *"
    const values = [id]
    const result = await pool.query(consulta, values)
    if (result.rowCount === 0) {
        throw { code: 404, message: "No se encontró el viaje para dar like" }
    }
    return result.rows[0]
}

module.exports = {
    agregarViaje,
    obtenerViajes,
    modificarPresupuesto,
    eliminarViaje,
    obtenerViaje,
    darLike
}
