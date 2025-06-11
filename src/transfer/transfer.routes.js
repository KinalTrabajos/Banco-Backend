import { Router } from 'express';
import { createTransfer } from './transfer.controller.js';
import { validatejwt } from "../middlewares/validate-JWT.js";
import { validateTransferBase, validateTransferLimits } from '../middlewares/validate-Transfer.js';

const router = Router();

router.post(
    '/makeTransfer',
    [
        validatejwt,
        validateTransferLimits, 
        validateTransferBase    
    ],
    createTransfer
);

export default router;