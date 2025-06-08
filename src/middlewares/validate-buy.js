import Account from "../account/account.model.js";

export const validateBuy = async (req, res, next) => {
    try {
        const { keeperUser, items } = req.body;

        if (!keeperUser || !items) {
            return res.status(400).json({
                error: "Faltan campos requeridos"
            });
        }

        const cuenta = await Account.findOne({ keeperUser });
        if (!cuenta) {
            return res.status(404).json({
                error: "Cuenta no encontrada para el usuario"
            });
        }

        req.account = cuenta;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: "Debe incluir al menos un producto"
            });
        }

        for (const item of items) {
            if (!item.name || item.quantity == null || item.price == null) {
                return res.status(400).json({
                    error: "Cada producto debe tener nombre, cantidad y precio"
                });
            }
            if (item.quantity <= 0 || item.price < 0) {
                return res.status(400).json({
                    error: "Cantidad debe ser mayor que 0 y precio mayor o igual a 0"
                });
            }
        }

        const total = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        req.body.totalTransaccion = total;

        next();

    } catch (error) {
        console.error("Error de validación:", error);
        res.status(500).json({
            error: "Error interno en la validación",
            detail: error.message
        });
    }
};