import Buy from "./buy.model.js";
import Account from "../account/account.model.js";
import Bill from "../bills/bill.model.js";

export const createBuy = async (req, res) => {
    try {
        const { keeperUser, items, totalTransaccion } = req.body;
        const cuenta = req.account;

        const newBuy = new Buy({
            keeperUser,
            items,
            totalTransaccion,
        });

        const savedBuy = await newBuy.save();

        const newBill = new Bill({
            account: cuenta._id,
            user: keeperUser,
            numeroFactura: `F-${Date.now()}`,
            total: totalTransaccion,
        });

        const savedBill = await newBill.save();

        return res.status(200).json({
            message: "Purchase and invoice created successfully",
            compra: savedBuy,
            factura: savedBill
        });

    } catch (error) {
        console.error("Error creating purchase:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const getBuys = async (req, res) => {
    try {
        const { role } = req.usuario;

        if (role !== "ADMIN_ROLE") {
            return res.status(403).json({
                msg: "Access denied. Only admins can view all purchases"
            });
        }
        const buys = await Buy.find().populate('keeperUser', 'name username email');

        res.status(200).json(buys);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            msg: "Error getting purchases",
            error: e.message
        });
    }
};

export const getBuyByUser = async (req, res) => {
    try {
        const { id } = req.params;
        const requesterId = req.usuario._id;
        const requesterRole = req.usuario.role;

        if (requesterId.toString() !== id && requesterRole !== "ADMIN_ROLE") {
            return res.status(403).json({
                msg: "You do not have permission to view these purchases"
            });
        }

        const buys = await Buy.find({ keeperUser: id })
            .populate('keeperUser', 'name username email')
            .populate('numeroCuenta', 'noAccount balance');

        if (!buys || buys.length === 0) {
            return res.status(404).json({
                msg: "No purchases found for this user"
            });
        }

        res.status(200).json(buys);

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            msg: "Error getting purchases",
            error: e.message
        });
    }
};

export const createBillFromBuy = async (req, res) => {
    try {
        const { buyId } = req.body;
        const userId = req.usuario  ._id;

        const buy = await Buy.findById(buyId);
        if (!buy) return res.status(404).json({ msg: "Purchase not found" });

        const account = await Account.findOne({ keeperUser: userId });
        if (!account) return res.status(404).json({ msg: "Account not found" });

        const factura = new Bill({
            account: account._id,
            user: userId,
            numeroFactura: `F-${Date.now()}`,
            total: buy.totalTransaccion,
            buy: buy._id
        });

        const saved = await factura.save();

        res.status(200).json({
            msg: "Invoice generated successfully",
            factura: saved
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error generating invoice",
            error: error.message
        });
    }
};