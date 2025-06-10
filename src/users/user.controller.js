import { response } from "express";
import { hash, verify } from 'argon2';
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true }
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener usuarios",
            error
        })
    }
}
export const updateUser = async (req, res  = response) => {
    try {
        const id = req.usuario._id;
        const { name, direction, work, income } = req.body;
        
        const allowedUpdates = {};
        if (name !== undefined) allowedUpdates.name = name;
        if (direction !== undefined) allowedUpdates.direction = direction;
        if (work !== undefined) allowedUpdates.work = work;
        if (income !== undefined) allowedUpdates.income = income;

        const user = await User.findByIdAndUpdate(id, allowedUpdates, { new: true });

        res.status(200).json({
            succes: true,
            msj: 'User updated successfully',
            user
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: 'Error updating user',
            error: error.message
        })
    }
};



export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(id, { status: false });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            msg: 'User disabled',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error deactivating user',
            error
        });
    }
};

export const updateUserPassword = async (req, res = response) => {
    try {
        const id = req.usuario._id;
        const { passwordNew, passwordOld } = req.body;

        const user = await User.findById(id);

        const validPassword = await verify(user.password, passwordOld);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                msg: "Old password incorrect",
                error: "Old password incorrect"
            });
        }

        const passwordHashed = await hash(passwordNew);

        await User.findByIdAndUpdate(id, { password: passwordHashed }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'User password updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updating user password',
            error: error.message
        });
    }
};
