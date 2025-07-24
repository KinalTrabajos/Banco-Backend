import { Router } from "express";
import { check } from "express-validator";
import {
    createAccountRequest,
    getPendingRequests,
    updateRequestStatus
} from "./accountRequest.controller.js";
import { validarCampos } from "../middlewares/validate-campos.js";
import { validatejwt } from "../middlewares/validate-jwt.js";
import { validateAdmin } from "../middlewares/validator-users.js";
import { existAccountRequestById } from "../helpers/db-validator.js";
import { registerValidator } from "../middlewares/validator.js";
import { validateAccountRequestStatusUpdate } from "../middlewares/validate-account-request.js";

const router = Router();

router.post(
    "/account-request",
    [
        registerValidator,
        validarCampos
    ],
    createAccountRequest
);

router.get(
    "/account-requests/view",
    validatejwt,
    validateAdmin,
    getPendingRequests
);

router.put(
    "/account-requests/:id",
    [
        validatejwt,
        validateAdmin,
        check("id", "Invalid ID").isMongoId(),
        check("id").custom(existAccountRequestById),
        validarCampos,
        validateAccountRequestStatusUpdate
    ],
    updateRequestStatus
);

export default router;