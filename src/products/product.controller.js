
import { response } from "express";
import Product from "./product.model.js";
import User from "../users/user.model.js";
export const addPorducts = async (req, res = response) => {
    const { nameProduct, price, description, ...data } = req.body;
    const user = await User.findById(data.keeperUser);
    try {
        const product = await Product.create({
            nameProduct,
            price,
            description,
            keeperUser: user._id
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

export const getProducts = async (req, res = response) => {
    const { limite = 100, desde = 0} = req.query;
    const query = { state: true };
    try {
        const products = await Product.find(query)
            .populate({path: 'keeperUser', match: { status: true }, select: 'nombreEmpresa'})
            .skip(Number(desde))
            .limit(Number(limite));
        const total = await Product.countDocuments(query);
        res.status(200).json({
            success: true,
            total,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener productos",
            error: error.message
        });
    }
}

export const getProductsByUserId = async (req, res = response) => {
    const { userId } = req.body;
    const { limite = 100, desde = 0} = req.query;
    const query = { state: true , keeperUser: userId };
    try {
        const products = await Product.find(query)
            .populate({path: 'keeperUser', match: { status: true }, select: 'nombreEmpresa'})
            .skip(Number(desde))
            .limit(Number(limite));
        const total = await Product.countDocuments(query);
        res.status(200).json({
            success: true,
            total,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener productos",
            error: error.message
        });
    }
}   

export const updateProduct = async (req, res = response) => {
    const { id } = req.params;
    const { nameProduct, price, description, keeperUser } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(id, { nameProduct, price, description, keeperUser }, { new: true });
        res.status(200).json({
            success: true,
            msg: "Producto actualizado correctamente",
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar producto",
            error: error.message
        });
    }
}

export const deleteProduct = async (req, res = response) => {
    const { id } = req.params;

    const { confirm } = req.body;

    try {

        if (!confirm){
            return res.status(400).json({
                success: false,
                msg: "Confirmación requerida"
            });
        }
        await Product.findByIdAndUpdate(id, { state: false });
        res.status(200).json({
            success: true,
            msg: "Producto eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al eliminar producto",
            error: error.message
        });
    }
}   