import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/validator.js";
import { validateJWT } from "../middlewares/validate-JWT.js";
import { validateAdmin } from "../middlewares/validator-users.js";

const router = Router();

router.post(
    '/login',
    loginValidator,
    login
)

router.post(
    '/register',
    registerValidator,
    validateJWT,
    validateAdmin,
    register
)

export default router;