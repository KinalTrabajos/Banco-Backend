import { Router } from "express";
import { check } from "express-validator";
import { deleteUser, getUsers, updateUser } from "./user.controller.js";
import { existUserById, existUsername } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validate-campos.js";
import { validatejwt } from "../middlewares/validate-JWT.js";
import { validateProperty, confirmDeletionValidation } from "../middlewares/validator-users.js"; 
const router = Router()

router.get("/", getUsers)

router.put(
    "/:id",
    [
        validatejwt,
        check("id", "Not a valid ID").isMongoId(),
        check("id").custom(existUserById),
        validateProperty,
        validarCampos
    ],
    updateUser

)

router.delete(
    "/:id",
    [
        validatejwt,
        confirmDeletionValidation,
        check("id", "Not a valid ID").isMongoId(),
        check("id").custom(existUserById),
        validateProperty,
        validarCampos
    ],
    deleteUser
)

export default router;