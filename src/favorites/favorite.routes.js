import { Router } from "express";
import {
    addFavorite,
    getFavoritesByAccount,
    toggleFavoriteStatus,
    deleteFavorite,
    updateFavoriteAlias
} from "../favorites/favorite.controller.js";
import { validarCampos } from "../middlewares/validate-campos.js";
import { validatejwt } from "../middlewares/validate-jwt.js";
import {
    validateAddFavorite,
    validateGetFavorites,
    validateToggleFavorite,
    validateDeleteFavorite,
    validateUpdateAlias
} from "../middlewares/validate-favorites.js";

const router = Router();

router.post(
    "/",
    [validatejwt, ...validateAddFavorite, validarCampos],
    addFavorite
);

router.get(
    "/:accountId",
    [validatejwt, ...validateGetFavorites, validarCampos],
    getFavoritesByAccount
);

router.patch(
    "/toggle",
    [validatejwt, ...validateToggleFavorite, validarCampos],
    toggleFavoriteStatus
);

router.patch(
    "/alias",
    [validatejwt, ...validateUpdateAlias, validarCampos],
    updateFavoriteAlias
);

router.delete(
    "/",
    [validatejwt, ...validateDeleteFavorite, validarCampos],
    deleteFavorite
);

export default router;
