import { Router } from 'express';
import { createTransfer, updateTransfer} from './transfer.controller.js';
import { validatejwt } from "../middlewares/validate-JWT.js";
import { validateTransferBase, validateTransferLimits, validateTransferEditable} from '../middlewares/validate-Transfer.js';

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

router.put(
    '/putTransfers/:id',
    [
        validatejwt,
        validateTransferEditable,
        validateTransferLimits
    ],
    updateTransfer
)

export default router;