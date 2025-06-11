import { response, request } from 'express';
import Favorite from './favorite.model.js';
import Account from '../account/account.model.js'; // Asegúrate de que esta ruta esté correcta

export const addFavorite = async (req = request, res = response) => {
    try {
        const { accountId, favoriteAccountId, alias } = req.body;

        if (accountId === favoriteAccountId) {
            return res.status(400).json({
                success: false,
                msg: "An account cannot favorite itself."
            });
        }

        const [accountExists, favoriteAccountExists] = await Promise.all([
            Account.findById(accountId),
            Account.findById(favoriteAccountId)
        ]);

        if (!accountExists || !favoriteAccountExists) {
            return res.status(404).json({
                success: false,
                msg: "One or both accounts do not exist."
            });
        }

        const favorite = await Favorite.findOneAndUpdate(
            { account: accountId, favoriteAccount: favoriteAccountId },
            { isFavorite: true, alias },
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

export const getFavoritesByAccount = async (req = request, res = response) => {
    try {
        const { accountId } = req.params;

        const favorites = await Favorite.find({ account: accountId, isFavorite: true })
            .populate('favoriteAccount', 'noAccount typeAccount balance points');

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
        const { accountId, favoriteAccountId } = req.body;

        const favorite = await Favorite.findOne({ account: accountId, favoriteAccount: favoriteAccountId });

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
        const { accountId, favoriteAccountId } = req.body;

        const deleted = await Favorite.findOneAndDelete({ account: accountId, favoriteAccount: favoriteAccountId });

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

export const updateFavoriteAlias = async (req = request, res = response) => {
    try {
        const { accountId, favoriteAccountId, alias } = req.body;

        if (!alias || typeof alias !== 'string') {
            return res.status(400).json({
                success: false,
                msg: "Alias is required and must be a string."
            });
        }

        const favorite = await Favorite.findOne({ account: accountId, favoriteAccount: favoriteAccountId });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                msg: "Favorite relationship not found"
            });
        }

        favorite.alias = alias.trim();
        await favorite.save();

        res.status(200).json({
            success: true,
            msg: "Alias updated successfully",
            favorite
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error updating alias",
            error: error.message
        });
    }
};
