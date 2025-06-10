import jwt from "jsonwebtoken";
import User from "../users/user.model.js";

export const validatejwt = async (req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "No token in the request",
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await User.findById(uid);

        if (!usuario || !usuario.status) {
            return res.status(401).json({
                msg: "Token inválido o usuario inactivo",
            });
        }

        req.usuario = usuario;
        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Invalid token",
        });
    }
};
