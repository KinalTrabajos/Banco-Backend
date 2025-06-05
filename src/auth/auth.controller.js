import User from "../users/user.model.js";
import { hash, verify } from "argon2";
import { generateJWT } from "../helpers/generate-jwt.js";

export const login = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const user = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        })
        if (!user) {
            return res.status(400).json({
                msg: "User or password incorrect",
                success: false
            })
        }
        if (!user.status) {
            return res.status(400).json({
                msg: "The user does not exist in the database",
                success: false
            })
        }
        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Password incorrect",
                success: false
            })
        }

        const token = await generateJWT(user.id);

        res.status(200).json({
            msg: "Login successful",
            userDetails: {
                username: user.username,
                email: user.email,
                token: token,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Contact the administrator",
            error: error.message
        });
    }
}

export const register = async(req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);
        const user = await User.create({
            name: data.name,
            username: data.username,
            dpi: data.dpi,
            direction: data.direction,
            phone: data.phone,
            email: data.email,
            password: encryptedPassword,
            work: data.work,
            nombreEmpresa: data.nombreEmpresa,
            income: data.income,
            role: data.role,
            typeAccount: data.typeAccount
        })
        return res.status(200).json({
            msg: "User registered successfully",
            userDetails: {
                user: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Contact the administrator",
            error: error.message
        })
    }
}

export const createAdmin = async(req, res) => {
    try{
        const existsAdmin = await User.findOne({ role: 'ADMIN_ROLE' });

        if(!existsAdmin){
            const hashed = await hash('1234567890');
            const adminUser = new User({
                name: 'Admin',
                username: 'admin',
                dpi: '3976668450101',
                direction: 'Admin Address',
                phone: '00000000',
                email: 'admin@gmail.com',
                password: hashed,
                work: 'Admin',
                income: 1000,
                role: 'ADMIN_ROLE',
                typeAccount: 'NORMAL'
            });

            await adminUser.save();

        }
    } catch (error) {
        console.log('error creating admin:', error);
        
    }
}