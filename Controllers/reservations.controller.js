import reservationModel from '../Models/reservations.model.js'

async function getAll(req, res) {
    try {
        const reservations = await reservationModel.getAll();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des réservations !" })
    }
}

async function getMine(req, res) {
    try {
        const reservations = await reservationModel.getByUserId(req.user.us_id);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de vos réservations !" })
    }
}

async function getByScreeningId(req, res) {
    try {
        const reservations = await reservationModel.getByScreeningId(req.params.screeningID);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des réservations !" })
    }
}

async function insert(req, res) {
    try {
        const body = req.body;
        if (!body.screening) {
            return res.status(403).json({ error: "La séance est obligatoire !" })
        }

        let seats = 1;
        if (body.seats !== undefined) {
            seats = body.seats;
        }
        if (!Number.isInteger(seats) || seats < 1) {
            return res.status(403).json({ error: "Le nombre de places doit être un entier supérieur ou égal à 1 !" })
        }

        const room = await reservationModel.getCapacity(body.screening);
        if (!room) {
            return res.status(404).json({ error: "La séance est introuvable !" })
        }

        const reserved = await reservationModel.getReservedSeats(body.screening);
        if (reserved + seats > room.ro_capacity) {
            return res.status(403).json({ error: "Plus assez de places disponibles" })
        }

        const reservation = {
            user: req.user.us_id,
            screening: body.screening,
            seats: seats
        }
        const inserted = await reservationModel.insert(reservation);
        res.status(201).json({ message: "Votre réservation à bien été effectué", id: inserted[0].insertId });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la réservation !" })
    }
}

async function deleteReservation(req, res) {
    try {
        const id = req.params.id;
        const reservation = await reservationModel.getById(id);
        if (!reservation) {
            return res.status(404).json({ error: "La réservation est introuvable !" })
        }

        if (req.user.us_role !== "admin" && reservation.re_user !== req.user.us_id) {
            return res.status(403).json({ error: "Cette réservation ne vous appartient pas !" })
        }

        await reservationModel.deleteReservation(id);
        res.json({ message: "Votre annulation à bien été effectué", reservation });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de l annulation !" })
    }
}

export default {
    getAll,
    getMine,
    getByScreeningId,
    insert,
    deleteReservation
}
