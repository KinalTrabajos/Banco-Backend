import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/validator.js";
import { validatejwt } from "../middlewares/validate-JWT.js";
import { validateAdmin, validateDpiUniqueness } from "../middlewares/validator-users.js";

const router = Router();

router.post(
    '/login',
    loginValidator,
    login
)

router.post(
    '/register',
    registerValidator,
    validatejwt,
    validateAdmin,
    register
)

router.post(
    '/registerEmpresa',
    registerValidator,
    validateDpiUniqueness,
    validatejwt,
    validateAdmin,
    register
)

export default router;