import Db from '../Config/db.js';

async function getAll() {
    const [rows] = await Db.query("SELECT * FROM films");
    return rows;
}

async function getShowing() {
    const [rows] = await Db.query("SELECT * FROM films WHERE fi_is_showing = 1");
    return rows;
}

async function getById(id) {
    const [rows] = await Db.query("SELECT * FROM films WHERE fi_id = ?", [id]);
    return rows[0];
}

async function getScreenings(filmId) {
    const [rows] = await Db.query(`SELECT sc_id, sc_datetime, sc_price, ro_name
        FROM screenings
        INNER JOIN rooms ON rooms.ro_id = screenings.sc_room
        WHERE sc_film = ? AND sc_datetime > NOW()
        ORDER BY sc_datetime`, [filmId]);
    return rows;
}

async function insert(film) {
    const inserted = await Db.query("INSERT INTO films(fi_title, fi_description, fi_duration, fi_genre, fi_release_date, fi_is_showing) VALUES (?,?,?,?,?,?)",
        [film.title, film.description, film.duration, film.genre, film.release_date, film.is_showing]);
    return inserted;
}

async function update(id, film) {
    const updated = await Db.query("UPDATE films SET fi_title = ?, fi_description = ?, fi_duration = ?, fi_genre = ?, fi_release_date = ?, fi_is_showing = ? WHERE fi_id = ?",
        [film.fi_title, film.fi_description, film.fi_duration, film.fi_genre, film.fi_release_date, film.fi_is_showing, id]);
    return updated;
}

async function deleteFilm(id) {
    const deleted = await Db.query("DELETE FROM films WHERE fi_id = ?", [id]);
    return deleted;
}

export default {
    getAll,
    getShowing,
    getById,
    getScreenings,
    insert,
    update,
    deleteFilm
}
