import { getAccountById, getAllAccounts } from "./account.controller.js";
import { validatejwt } from "../middlewares/validate-JWT.js";
import { validateAdmin } from "../middlewares/validator-users.js";
import { Router } from "express";

const router = Router();

router.get(
    '/getAccount/:id',
    getAccountById
)

router.get(
    '/getAccount',
    [
        validatejwt,
        validateAdmin
    ],
    getAllAccounts
)

export default router;