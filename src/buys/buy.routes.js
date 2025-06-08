import { Router } from "express";
import { check } from "express-validator";
import { validateBuy } from "../middlewares/validate-buy.js";
import { createBuy, getBuys, getBuyByUser } from "../buys/buy.controller.js";
import { validatejwt } from "../middlewares/validate-jwt.js";

const router = Router()

router.post(
    "/",
    [
        validatejwt,
        validateBuy
    ],
    createBuy
);

router.get(
    "/",
    validatejwt, 
    getBuys
);

router.get(
    "/:id",
    [
        check("id","Not a valid ID").isMongoId()
    ],
    getBuyByUser
)

export default router;