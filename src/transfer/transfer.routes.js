import { Router } from 'express';
import { cancelTransfer, createTransfer, updateTransfer } from './transfer.controller.js';
import { validatejwt } from "../middlewares/validate-jwt.js";
import { validateTransferBase, validateTransferLimits, validateTransferEditable, validateTransferCancelable, validateUpdateTransferData } from '../middlewares/validate-Transfer.js';

const router = Router();

router.post(
    '/makeTransfer',
    [
        validatejwt,
        validateTransferBase,
        validateTransferLimits
    ],
    createTransfer
);

router.put(
    '/putTransfers/:id',
    [
        validatejwt,
        validateTransferEditable,     
        validateUpdateTransferData,
        validateTransferLimits
    ],
    updateTransfer
);

router.delete(
    '/cancelTransfer/:id',
    [
        validatejwt,
        validateTransferCancelable
    ],
    cancelTransfer
);

export default router;