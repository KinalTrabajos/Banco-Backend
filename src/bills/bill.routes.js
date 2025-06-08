import { Router } from "express";
import { check } from "express-validator";
import { getBillByUser, getBills } from "./bill.controller.js";
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
    getBillByUser
)

router.get(
    "/",
    [
        validatejwt
    ],
    getBills
)

export default router;