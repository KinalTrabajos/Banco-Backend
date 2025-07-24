import Account from "./account.model.js"
import User from "../users/user.model.js"

export const getAccount = async (req, res) => {
    try {
        const { noAccount, id } = req.query;
        let account;

        if (noAccount) {
            account = await Account.findOne({ noAccount }).populate('keeperUser', 'name email username');
        } else if (id && req.foundUser) {
            account = await Account.findOne({ keeperUser: req.foundUser._id }).populate('keeperUser', 'name email username');
        }

        if (!account) {
            return res.status(404).json({
                success: false,
                msg: 'Cuenta no encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            account
        });

    } catch (error) {
        console.error("Error en el controlador getAccount:", error);
        return res.status(500).json({
            success: false,
            msg: 'Error al buscar la cuenta.',
            error: error.message
        });
    }
};

export const getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find().populate('keeperUser', 'name email username');

        return res.status(200).json({
            success: true,
            accounts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener las cuentas.',
            error: error.message
        });
    }
};

export const rewardPointsService = async () => {
    try {
        const accounts = await Account.find({ balance: { $gt: 1000 } });

        for (const account of accounts) {
            account.points += 1;
            await account.save();
        }

        console.log(`[${new Date().toISOString()}] Puntos otorgados a cuentas con balance > 1000`);
    } catch (error) {
        console.error('Error en rewardPointsService:', error.message);
    }
};
