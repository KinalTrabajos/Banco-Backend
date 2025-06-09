import Account from "./account.model.js"
import User from "../users/user.model.js"

export const getAccount = async (req, res) => {
    try {
        const { noAccount, dpi } = req.query;
        let account;

        if (noAccount) {
            account = await Account.findOne({ noAccount }).populate('keeperUser', 'name email username');
        } else if (dpi) {
            const user = await User.findOne({ dpi });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    msg: 'Usuario con ese DPI no encontrado',
                });
            }
            account = await Account.findOne({ keeperUser: user._id }).populate('keeperUser', 'name email username');
        }

        if (!account) {
            return res.status(404).json({
                success: false,
                msg: 'Cuenta no encontrada',
            });
        }

        return res.status(200).json({
            success: true,
            account
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al buscar la cuenta',
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
            msg: 'Error fetching accounts',
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
