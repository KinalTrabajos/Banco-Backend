import { Router } from 'express';
import { createTransfer } from './transfer.controller.js';
import { validatejwt } from "../middlewares/validate-JWT.js";
import { validateTransfer } from '../middlewares/validate-Transfer.js';

const router = Router();

router.post(
    '/makeTransfer',
    [
        validatejwt,
        validateTransfer
    ],
    createTransfer
);

export default router;