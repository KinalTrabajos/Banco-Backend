import { response, request } from 'express';
import Favorite from './favorite.model.js';
import User from '../users/user.model.js';

export const addFavorite = async (req = request, res = response) => {
    try {
        const { userId, favoriteUserId } = req.body;

        if (userId === favoriteUserId) {
            return res.status(400).json({
                success: false,
                msg: "A user cannot favorite themselves."
            });
        }

        const [userExists, favoriteExists] = await Promise.all([
            User.findById(userId),
            User.findById(favoriteUserId)
        ]);

        if (!userExists || !favoriteExists || !userExists.status || !favoriteExists.status) {
            return res.status(404).json({
                success: false,
                msg: "One or both users do not exist or are inactive."
            });
        }

        const favorite = await Favorite.findOneAndUpdate(
            { user: userId, favoriteUser: favoriteUserId },
            { isFavorite: true },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            success: true,
            msg: "Favorite added/updated successfully.",
            favorite
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error adding favorite",
            error: error.message
        });
    }
};

export const getFavoritesByUser = async (req = request, res = response) => {
    try {
        const { userId } = req.params;

        const favorites = await Favorite.find({ user: userId, isFavorite: true })
            .populate('favoriteUser', 'name email username noAccount');

        res.status(200).json({
            success: true,
            favorites
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error fetching favorites",
            error: error.message
        });
    }
};

export const toggleFavoriteStatus = async (req = request, res = response) => {
    try {
        const { userId, favoriteUserId } = req.body;

        const favorite = await Favorite.findOne({ user: userId, favoriteUser: favoriteUserId });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                msg: "Favorite relationship not found"
            });
        }

        favorite.isFavorite = !favorite.isFavorite;
        await favorite.save();

        res.status(200).json({
            success: true,
            msg: "Favorite status updated",
            favorite
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error updating favorite",
            error: error.message
        });
    }
};

export const deleteFavorite = async (req = request, res = response) => {
    try {
        const { userId, favoriteUserId } = req.body;

        const deleted = await Favorite.findOneAndDelete({ user: userId, favoriteUser: favoriteUserId });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                msg: "Favorite not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Favorite removed successfully",
            deleted
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error deleting favorite",
            error: error.message
        });
    }
};
