import { Router } from "express";
import {
    addFavorite,
    getFavoritesByOwner,  // Cambié el alias para que sea coherente
    toggleFavoriteStatus,
    deleteFavorite,
    updateFavoriteAlias,
    getFavoriteById,
    getAllFavorites,
    searchFavoriteByAlias
} from "../favorites/favorite.controller.js";

import { validarCampos } from "../middlewares/validate-campos.js";
import { validatejwt } from "../middlewares/validate-jwt.js";
import { validateAdmin } from "../middlewares/validator-users.js"; 

import {
    validateAddFavorite,
    validateToggleFavorite,
    validateDeleteFavorite,
    validateUpdateAlias,
    validateGetFavoriteById,
    validateSearchAlias
} from "../middlewares/validate-favorites.js";

const router = Router();

// Crear o actualizar favorito
router.post(
    "/",
    [
        validatejwt,
        ...validateAddFavorite,
        validarCampos
    ],
    addFavorite
);

// Obtener favoritos por usuario autenticado (sin parámetro)
router.get(
    "/account",
    [
        validatejwt,
        validarCampos
    ],
    getFavoritesByOwner
);

// Listar todos los favoritos (solo ADMIN)
router.get(
    "/",
    [
        validatejwt,
        validateAdmin, 
        validarCampos
    ],
    getAllFavorites
);

// Buscar favoritos por alias
router.get(
    "/search/alias",
    [
        validatejwt,
        ...validateSearchAlias,
        validarCampos
    ],
    searchFavoriteByAlias
);

// Obtener favorito por ID
router.get(
    "/:id",
    [
        validatejwt,
        ...validateGetFavoriteById,
        validarCampos
    ],
    getFavoriteById
);

// Cambiar estado de favorito (toggle)
router.patch(
    "/toggle",
    [
        validatejwt,
        ...validateToggleFavorite,
        validarCampos
    ],
    toggleFavoriteStatus
);

// Actualizar alias del favorito
router.patch(
    "/alias",
    [
        validatejwt,
        ...validateUpdateAlias,
        validarCampos
    ],
    updateFavoriteAlias
);

// Eliminar favorito
router.delete(
    "/",
    [
        validatejwt,
        ...validateDeleteFavorite,
        validarCampos
    ],
    deleteFavorite
);

export default router;
