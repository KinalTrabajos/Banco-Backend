
import { response } from "express";
import Product from "./product.model.js";

export const addPorducts = async (req, res = response) => {
    const { nameProduct, price, description, keeperUser } = req.body;

    try {
        const product = await Product.create({
            nameProduct,
            price,
            description,
            keeperUser
        });

        res.status(200).json({
            success: true,
            msg: "Producto agregado correctamente",
            product
        }); 
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al agregar producto",
            error: error.message
        });
    }
}