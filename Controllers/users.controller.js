import userModel from '../Models/users.model.js'

async function getAll(req, res) {
    try {
        const users = await userModel.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des users !" })
    }
}

async function getMe(req, res) {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du profil !" })
    }
}

async function getById(req, res) {
    try {
        const id = req.params.id;
        const user = await userModel.getById(id);
        if (!user) {
            return res.status(404).json({ error: "Le user est introuvable !" })
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération du user !" })
    }
}

async function update(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;

        if (req.user.us_role !== "admin" && req.user.us_id != id) {
            return res.status(403).json({ error: "Vous ne pouvez modifier que votre profil !" })
        }

        const user = await userModel.getById(id);
        if (!user) {
            return res.status(404).json({ error: "Le user est introuvable !" })
        }

        if (body.username) {
            user.us_username = body.username;
        }
        if (body.email) {
            user.us_email = body.email;
        }
        await userModel.update(id, user);
        res.json({ message: "Votre modification à bien été effectué", user });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification du user !" })
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const user = await userModel.getById(id);
        if (!user) {
            return res.status(404).json({ error: "Le user est introuvable !" })
        }
        await userModel.deleteUser(id);
        res.json({ message: "Votre suppression à bien été effectué", user });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression du user !" })
    }
}

export default {
    getAll,
    getMe,
    getById,
    update,
    deleteUser
}
