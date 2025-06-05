import { check } from 'express-validator';
import { existUserById } from '../helpers/db-validator.js';

export const validateAddFavorite = [
    check("userId", "Invalid user ID").isMongoId(),
    check("favoriteUserId", "Invalid favorite user ID").isMongoId(),
    check("userId").custom(existUserById),
    check("favoriteUserId").custom(existUserById)
];

export const validateGetFavorites = [
    check("userId", "Invalid user ID").isMongoId(),
    check("userId").custom(existUserById)
];

export const validateToggleFavorite = [
    check("userId", "Invalid user ID").isMongoId(),
    check("favoriteUserId", "Invalid favorite user ID").isMongoId(),
    check("userId").custom(existUserById),
    check("favoriteUserId").custom(existUserById)
];

export const validateDeleteFavorite = [
    check("userId", "Invalid user ID").isMongoId(),
    check("favoriteUserId", "Invalid favorite user ID").isMongoId(),
    check("userId").custom(existUserById),
    check("favoriteUserId").custom(existUserById)
];
