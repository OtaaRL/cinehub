import roomModel from '../Models/rooms.model.js'

async function getAll(req, res) {
    try {
        const rooms = await roomModel.getAll();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des salles !" })
    }
}

async function getById(req, res) {
    try {
        const id = req.params.id;
        const room = await roomModel.getById(id);
        if (!room) {
            return res.status(404).json({ error: "La salle est introuvable !" })
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de la salle !" })
    }
}

async function insert(req, res) {
    try {
        const body = req.body;
        if (!body.name || !body.capacity) {
            return res.status(403).json({ error: "Le nom et la capacité sont obligatoires !" })
        }
        const inserted = await roomModel.insert(body);
        res.status(201).json({ message: "Votre insertion à bien été effectué", id: inserted[0].insertId });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de l insertion de la salle !" })
    }
}

async function update(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;
        const room = await roomModel.getById(id);
        if (!room) {
            return res.status(404).json({ error: "La salle est introuvable !" })
        }

        if (body.name) {
            room.ro_name = body.name;
        }
        if (body.capacity) {
            room.ro_capacity = body.capacity;
        }
        await roomModel.update(id, room);
        res.json({ message: "Votre modification à bien été effectué", room });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification de la salle !" })
    }
}

async function deleteRoom(req, res) {
    try {
        const id = req.params.id;
        const room = await roomModel.getById(id);
        if (!room) {
            return res.status(404).json({ error: "La salle est introuvable !" })
        }
        await roomModel.deleteRoom(id);
        res.json({ message: "Votre suppression à bien été effectué", room });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression de la salle !" })
    }
}

export default {
    getAll,
    getById,
    insert,
    update,
    deleteRoom
}
