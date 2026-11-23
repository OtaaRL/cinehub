import screeningModel from '../Models/screenings.model.js'

async function getAll(req, res) {
    try {
        const screenings = await screeningModel.getAll();
        res.json(screenings);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des séances !" })
    }
}

async function getByFilmId(req, res) {
    try {
        const screenings = await screeningModel.getByFilmId(req.params.filmID);
        res.json(screenings);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des séances !" })
    }
}

async function getById(req, res) {
    try {
        const id = req.params.id;
        const screening = await screeningModel.getById(id);
        if (!screening) {
            return res.status(404).json({ error: "La séance est introuvable !" })
        }
        res.json(screening);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de la séance !" })
    }
}

async function insert(req, res) {
    try {
        const body = req.body;
        if (!body.film || !body.room || !body.datetime || !body.price) {
            return res.status(403).json({ error: "Tout les champs sont obligatoires !" })
        }
        const inserted = await screeningModel.insert(body);
        res.status(201).json({ message: "Votre insertion à bien été effectué", id: inserted[0].insertId });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de l insertion de la séance !" })
    }
}

async function update(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;
        const screening = await screeningModel.getById(id);
        if (!screening) {
            return res.status(404).json({ error: "La séance est introuvable !" })
        }

        if (body.film) {
            screening.sc_film = body.film;
        }
        if (body.room) {
            screening.sc_room = body.room;
        }
        if (body.datetime) {
            screening.sc_datetime = body.datetime;
        }
        if (body.price) {
            screening.sc_price = body.price;
        }
        await screeningModel.update(id, screening);
        res.json({ message: "Votre modification à bien été effectué", screening });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification de la séance !" })
    }
}

async function deleteScreening(req, res) {
    try {
        const id = req.params.id;
        const screening = await screeningModel.getById(id);
        if (!screening) {
            return res.status(404).json({ error: "La séance est introuvable !" })
        }
        await screeningModel.deleteScreening(id);
        res.json({ message: "Votre suppression à bien été effectué", screening });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression de la séance !" })
    }
}

export default {
    getAll,
    getByFilmId,
    getById,
    insert,
    update,
    deleteScreening
}
