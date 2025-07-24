import User from '../users/user.model.js';

export const validateAccountQuery = async (req, res, next) => {
    const { noAccount, id } = req.query;

    if (!noAccount && !id) {
        return res.status(400).json({
            success: false,
            msg: 'Debe proporcionar al menos un número de cuenta (noAccount) o un ID de usuario (id) como parámetro de búsqueda.'
        });
    }

    if (id) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                msg: 'El ID proporcionado no es válido (debe tener 24 caracteres hexadecimales).'
            });
        }
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    msg: 'Usuario con ese ID no encontrado.'
                });
            }
            req.foundUser = user;
        } catch (error) {
            console.error("Error al buscar usuario en validateAccountQuery:", error);
            return res.status(500).json({
                success: false,
                msg: 'Error interno al buscar el usuario por ID.',
                error: error.message
            });
        }
    }

    next();
};