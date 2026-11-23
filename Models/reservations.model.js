import Db from '../Config/db.js';

async function getAll() {
    const [rows] = await Db.query("SELECT * FROM reservations");
    return rows;
}

async function getById(id) {
    const [rows] = await Db.query("SELECT * FROM reservations WHERE re_id = ?", [id]);
    return rows[0];
}

async function getByUserId(userId) {
    const [rows] = await Db.query(`SELECT re_id, re_seats, fi_title, sc_datetime, ro_name, sc_price
        FROM reservations
        INNER JOIN screenings ON screenings.sc_id = reservations.re_screening
        INNER JOIN films ON films.fi_id = screenings.sc_film
        INNER JOIN rooms ON rooms.ro_id = screenings.sc_room
        WHERE re_user = ?`, [userId]);
    return rows;
}

async function getByScreeningId(screeningId) {
    const [rows] = await Db.query("SELECT * FROM reservations WHERE re_screening = ?", [screeningId]);
    return rows;
}

async function getReservedSeats(screeningId) {
    const [rows] = await Db.query("SELECT SUM(re_seats) AS total FROM reservations WHERE re_screening = ?", [screeningId]);
    return Number(rows[0].total) || 0;
}

async function getCapacity(screeningId) {
    const [rows] = await Db.query(`SELECT ro_capacity
        FROM screenings
        INNER JOIN rooms ON rooms.ro_id = screenings.sc_room
        WHERE sc_id = ?`, [screeningId]);
    return rows[0];
}

async function insert(reservation) {
    const inserted = await Db.query("INSERT INTO reservations(re_user, re_screening, re_seats) VALUES (?,?,?)",
        [reservation.user, reservation.screening, reservation.seats]);
    return inserted;
}

async function deleteReservation(id) {
    const deleted = await Db.query("DELETE FROM reservations WHERE re_id = ?", [id]);
    return deleted;
}

export default {
    getAll,
    getById,
    getByUserId,
    getByScreeningId,
    getReservedSeats,
    getCapacity,
    insert,
    deleteReservation
}
