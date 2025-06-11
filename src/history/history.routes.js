import { Router } from "express";
import { check } from "express-validator";
import { getAllHistories, getHistoryFromUser } from "./history.controller.js";
import { validatejwt } from "../middlewares/validate-jwt.js";
import { validarCampos } from "../middlewares/validate-campos.js";

const router = Router()

router.get(
    "/:id",
    [
        validatejwt,
        check("id", "Not a valid ID").isMongoId(),
        validarCampos
    ],
    getHistoryFromUser
);

router.get(
    "/",
    validatejwt,
    getAllHistories
);

export default router;