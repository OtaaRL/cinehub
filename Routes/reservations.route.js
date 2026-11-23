import e from "express";
import reservationController from '../Controllers/reservations.controller.js'
import checkAdmin from '../Middlewares/admin.middleware.js'

const router = e.Router();

router.get("/", checkAdmin, reservationController.getAll);

router.get("/me", reservationController.getMine);

router.get("/screening/:screeningID", checkAdmin, reservationController.getByScreeningId);

router.post("/", reservationController.insert);

router.delete("/:id", reservationController.deleteReservation);

export default router;
