import Db from '../Config/db.js';

async function getAll() {
    const [rows] = await Db.query(`SELECT sc_id, sc_datetime, sc_price, fi_title, ro_name
        FROM screenings
        INNER JOIN films ON films.fi_id = screenings.sc_film
        INNER JOIN rooms ON rooms.ro_id = screenings.sc_room`);
    return rows;
}

async function getByFilmId(filmId) {
    const [rows] = await Db.query(`SELECT sc_id, sc_datetime, sc_price, fi_title, ro_name
        FROM screenings
        INNER JOIN films ON films.fi_id = screenings.sc_film
        INNER JOIN rooms ON rooms.ro_id = screenings.sc_room
        WHERE sc_film = ?`, [filmId]);
    return rows;
}

async function getById(id) {
    const [rows] = await Db.query("SELECT * FROM screenings WHERE sc_id = ?", [id]);
    return rows[0];
}

async function insert(screening) {
    const inserted = await Db.query("INSERT INTO screenings(sc_film, sc_room, sc_datetime, sc_price) VALUES (?,?,?,?)",
        [screening.film, screening.room, screening.datetime, screening.price]);
    return inserted;
}

async function update(id, screening) {
    const updated = await Db.query("UPDATE screenings SET sc_film = ?, sc_room = ?, sc_datetime = ?, sc_price = ? WHERE sc_id = ?",
        [screening.sc_film, screening.sc_room, screening.sc_datetime, screening.sc_price, id]);
    return updated;
}

async function deleteScreening(id) {
    const deleted = await Db.query("DELETE FROM screenings WHERE sc_id = ?", [id]);
    return deleted;
}

export default {
    getAll,
    getByFilmId,
    getById,
    insert,
    update,
    deleteScreening
}
