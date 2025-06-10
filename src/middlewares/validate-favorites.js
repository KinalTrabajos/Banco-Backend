import { check, param, query } from 'express-validator';
import { existAccountById, existFavoriteById } from '../helpers/db-validator.js';

export const validateAddFavorite = [
    check("target", "El ID del objetivo debe ser un ID válido de Mongo").isMongoId(),
    check("target").custom(existAccountById),
    check("alias", "El alias debe ser una cadena válida").optional().isString()
];

export const validateToggleFavorite = [
    check("target", "El ID del objetivo debe ser un ID válido de Mongo").isMongoId(),
    check("target").custom(existAccountById)
];

export const validateDeleteFavorite = [
    check("target", "El ID del objetivo debe ser un ID válido de Mongo").isMongoId(),
    check("target").custom(existAccountById)
];

export const validateUpdateAlias = [
    check("target", "El ID del objetivo debe ser un ID válido de Mongo").isMongoId(),
    check("target").custom(existAccountById),
    check("alias", "El alias es obligatorio y debe ser una cadena no vacía").isString().notEmpty()
];

export const validateGetFavoriteById = [
    param("id", "El ID del favorito debe ser un ID válido de Mongo").isMongoId(),
    param("id").custom(existFavoriteById)
];

export const validateSearchAlias = [
    query("alias", "El alias de búsqueda es requerido y debe ser una cadena no vacía").isString().notEmpty()
];

export const validateGetFavorites = [
    param("accountId", "El ID de la cuenta debe ser un ID válido de Mongo").isMongoId(),
    param("accountId").custom(existAccountById)
];
