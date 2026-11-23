import filmModel from '../Models/films.model.js'

async function getAll(req, res) {
    try {
        const films = await filmModel.getAll();
        res.json(films);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des films !" })
    }
}

async function getShowing(req, res) {
    try {
        const films = await filmModel.getShowing();
        res.json(films);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des films à l affiche !" })
    }
}

async function getById(req, res) {
    try {
        const id = req.params.id;
        const film = await filmModel.getById(id);
        if (!film) {
            return res.status(404).json({ error: "Le film est introuvable !" })
        }
        film.screenings = await filmModel.getScreenings(id);
        res.json(film);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du film !" })
    }
}

async function insert(req, res) {
    try {
        const body = req.body;
        if (!body.title || !body.duration) {
            return res.status(403).json({ error: "Le titre et la durée sont obligatoires !" })
        }
        if (body.is_showing === undefined) {
            body.is_showing = true;
        }
        const inserted = await filmModel.insert(body);
        res.status(201).json({ message: "Votre insertion à bien été effectué", id: inserted[0].insertId });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de l insertion du film !" })
    }
}

async function update(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;
        const film = await filmModel.getById(id);
        if (!film) {
            return res.status(404).json({ error: "Le film est introuvable !" })
        }

        if (body.title) {
            film.fi_title = body.title;
        }
        if (body.description) {
            film.fi_description = body.description;
        }
        if (body.duration) {
            film.fi_duration = body.duration;
        }
        if (body.genre) {
            film.fi_genre = body.genre;
        }
        if (body.release_date) {
            film.fi_release_date = body.release_date;
        }
        if (body.is_showing !== undefined) {
            film.fi_is_showing = body.is_showing;
        }
        await filmModel.update(id, film);
        res.json({ message: "Votre modification à bien été effectué", film });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification du film !" })
    }
}

async function deleteFilm(req, res) {
    try {
        const id = req.params.id;
        const film = await filmModel.getById(id);
        if (!film) {
            return res.status(404).json({ error: "Le film est introuvable !" })
        }
        await filmModel.deleteFilm(id);
        res.json({ message: "Votre suppression à bien été effectué", film });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression du film !" })
    }
}

export default {
    getAll,
    getShowing,
    getById,
    insert,
    update,
    deleteFilm
}
