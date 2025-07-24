import Account from "../account/account.model.js";
import Product from "../products/product.model.js";

export const validateBuy = async (req, res, next) => {
    try {
        const { keeperUser, items } = req.body;

        if (!keeperUser || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "You must provide a user and at least one product"
            });
        }

        const processedItems = [];
        let total = 0;

        for (const item of items) {
            if (!item.product || item.quantity == null) {
                return res.status(400).json({
                    success: false,
                    msg: "Each item must have a product ID and a quantity"
                });
            }

            if (item.quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    msg: "The amount must be greater than 0"
                });
            }

            const product = await Product.findById(item.product);
            if (!product || !product.state) {
                return res.status(404).json({
                    success: false,
                    msg: `Product with ID ${item.product} not found or inactive`
                });
            }

            const subtotal = product.price * item.quantity;
            total += subtotal;

            processedItems.push({
                product: product._id,
                quantity: item.quantity,
            });
        }

        const cuenta = await Account.findOne({ keeperUser });
        if (!cuenta) {
            return res.status(404).json({
                success: false,
                msg: "Account not found for the user"
            });
        }

        req.account = cuenta;
        req.processedItems = processedItems;
        req.total = total;

        next();

    } catch (error) {
        console.error("Validation error:", error);
        res.status(500).json({
            success: false,
            msg: "Internal server error during buy validation",
            error: error.message
        });
    }
};

export const validateCreateBuy = async (req, res, next) => {
    try {
        const cuenta = req.account;
        const total = req.total;

        if (cuenta.balance < total) {
            return res.status(400).json({
                success: false,
                msg: "Insufficient balance at the time of purchase"
            });
        }

        next();
    } catch (error) {
        console.error("Error creating purchase:", error);
        return res.status(500).json({
            success: false,
            message: "Error when making the purchase",
            error: error.message,
        });
    }
}

export const validateCreateBuyByPoints = async (req, res, next) => {
    try {
        const cuenta = req.account;
        const total = req.total;

        if (cuenta.points < total) {
            return res.status(400).json({
                success: false,
                msg: "Insufficient points at the time of purchase"
            });
        }

        next();
    } catch (error) {
        console.error("Error creating purchase:", error);
        return res.status(500).json({
            success: false,
            message: "Error when making the purchase",
            error: error.message,
        });
    }
}

export const validateGetBuys = async (req, res, next) => {
    try {
        const { role } = req.usuario;

        if (role !== "ADMIN_ROLE") {
            return res.status(403).json({
                msg: "Access denied. Only admins can view all purchases",
            });
        }

        next();
    } catch (error) {
        console.error("Error creating purchase:", error);
        return res.status(500).json({
            success: false,
            message: "Error when making the purchase",
            error: error.message,
        });
    }
}

export const validateGetBuyByUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const requesterId = req.usuario._id;
        const requesterRole = req.usuario.role;

        if (requesterId.toString() !== id && requesterRole !== "ADMIN_ROLE") {
            return res.status(403).json({
                msg: "You do not have permission to view these purchases",
            });
        }

        next();

    } catch (error) {
        console.error("Error validating permissions:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};