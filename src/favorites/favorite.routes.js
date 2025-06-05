import { Router } from "express";
import {
    addFavorite,
    getFavoritesByUser,
    toggleFavoriteStatus,
    deleteFavorite
} from "../favorites/favorite.controller.js";
import { validarCampos } from "../middlewares/validate-campos.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import {
    validateAddFavorite,
    validateGetFavorites,
    validateToggleFavorite,
    validateDeleteFavorite
} from "../middlewares/validate-favorites.js";

const router = Router();

router.post(
    "/",
    [validateJWT, ...validateAddFavorite, validarCampos],
    addFavorite
);

router.get(
    "/:userId",
    [validateJWT, ...validateGetFavorites, validarCampos],
    getFavoritesByUser
);

router.patch(
    "/toggle",
    [validateJWT, ...validateToggleFavorite, validarCampos],
    toggleFavoriteStatus
);

router.delete(
    "/",
    [validateJWT, ...validateDeleteFavorite, validarCampos],
    deleteFavorite
);

export default router;
