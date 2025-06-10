import { request, response } from 'express';
import Favorite from './favorite.model.js';
import Account from '../account/account.model.js';

// Crear o actualizar favorito
export const addFavorite = async (req = request, res = response) => {
    try {
        const owner = req.usuario.id;
        const { target, alias } = req.body;

        if (owner === target) {
            return res.status(400).json({
                success: false,
                msg: "No puedes agregarte a ti mismo como favorito."
            });
        }

        const targetExists = await Account.findById(target);
        if (!targetExists) {
            return res.status(404).json({
                success: false,
                msg: "La cuenta a marcar como favorita no existe."
            });
        }

        const favorite = await Favorite.findOneAndUpdate(
            { owner, target },
            { isFavorite: true, alias },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(201).json({
            success: true,
            msg: "Favorito agregado o actualizado correctamente.",
            favorite
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al agregar favorito",
            error: error.message
        });
    }
};

// Obtener favoritos solo del usuario autenticado
export const getFavoritesByOwner = async (req = request, res = response) => {
    try {
        const owner = req.usuario.id;

        const favorites = await Favorite.find({ owner, isFavorite: true })
            .populate('target', 'noAccount typeAccount balance points');

        res.status(200).json({
            success: true,
            favorites
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener favoritos",
            error: error.message
        });
    }
};

// Alternar estado de favorito
export const toggleFavoriteStatus = async (req = request, res = response) => {
    try {
        const owner = req.usuario.id;
        const { target } = req.body;

        const favorite = await Favorite.findOne({ owner, target });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                msg: "No se encontró la relación de favorito."
            });
        }

        favorite.isFavorite = !favorite.isFavorite;
        await favorite.save();

        res.status(200).json({
            success: true,
            msg: "Estado de favorito actualizado.",
            favorite
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar estado del favorito",
            error: error.message
        });
    }
};

// Eliminar favorito
export const deleteFavorite = async (req = request, res = response) => {
    try {
        const owner = req.usuario.id;
        const { target } = req.body;

        const deleted = await Favorite.findOneAndDelete({ owner, target });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                msg: "Favorito no encontrado."
            });
        }

        res.status(200).json({
            success: true,
            msg: "Favorito eliminado correctamente.",
            deleted
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al eliminar favorito",
            error: error.message
        });
    }
};

// Actualizar alias del favorito
export const updateFavoriteAlias = async (req = request, res = response) => {
    try {
        const owner = req.usuario.id;
        const { target, alias } = req.body;

        if (!alias || typeof alias !== 'string') {
            return res.status(400).json({
                success: false,
                msg: "El alias es obligatorio y debe ser una cadena de texto."
            });
        }

        const favorite = await Favorite.findOne({ owner, target });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                msg: "Relación de favorito no encontrada."
            });
        }

        favorite.alias = alias.trim();
        await favorite.save();

        res.status(200).json({
            success: true,
            msg: "Alias actualizado correctamente.",
            favorite
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar alias",
            error: error.message
        });
    }
};

// Buscar favorito por ID
export const getFavoriteById = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const favorite = await Favorite.findById(id)
            .populate('owner', 'username')
            .populate('target', 'noAccount typeAccount balance');

        if (!favorite) {
            return res.status(404).json({
                success: false,
                msg: "Favorito no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            favorite
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener favorito por ID",
            error: error.message
        });
    }
};

// Listar todos los favoritos
export const getAllFavorites = async (req = request, res = response) => {
    const { limit = 10, offset = 0 } = req.query;

    try {
        const [total, favorites] = await Promise.all([
            Favorite.countDocuments(),
            Favorite.find()
                .populate('owner', 'username')
                .populate('target', 'noAccount')
                .skip(Number(offset))
                .limit(Number(limit))
        ]);

        res.status(200).json({
            success: true,
            total,
            favorites
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al listar favoritos",
            error: error.message
        });
    }
};

// Buscar por alias (solo propios)
export const searchFavoriteByAlias = async (req = request, res = response) => {
    try {
        const owner = req.usuario.id;
        const { alias } = req.query;

        const favorites = await Favorite.find({
            owner,
            alias: { $regex: alias, $options: 'i' }, 
            isFavorite: true
        }).populate('target', 'noAccount typeAccount');

        res.status(200).json({
            success: true,
            results: favorites
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al buscar favoritos por alias",
            error: error.message
        });
    }
};
