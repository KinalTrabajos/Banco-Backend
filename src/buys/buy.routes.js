import { Router } from "express";
import { check } from "express-validator";
import { validateBuy, validateCreateBuy, validateCreateBuyByPoints, validateGetBuyByUser, validateGetBuys } from "../middlewares/validate-buy.js";
import { createBuy, getBuys, getBuyByUser, createBuyByPoints } from "../buys/buy.controller.js";
import { validatejwt } from "../middlewares/validate-jwt.js";

const router = Router()

router.post(
    "/",
    [
        validatejwt,
        validateBuy, validateCreateBuy
    ],
    createBuy
);

router.post(
    "/points/",
    [
        validatejwt,
        validateBuy, validateCreateBuyByPoints
    ],
    createBuyByPoints
)

router.get(
    "/",
    validatejwt,
    validateGetBuys, 
    getBuys
);

router.get(
    "/:id",
    [
        check("id","Not a valid ID").isMongoId(),
        validateGetBuyByUser
    ],
    getBuyByUser
)

export default router;