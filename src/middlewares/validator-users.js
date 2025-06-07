import User from '../users/user.model.js'

export const validateProperty = async (req, res, next) => {
    const { id } = req.params;
    const userLogued = req.usuario.id;
    const user = req.usuario.role;

    if (user != "ADMIN_ROLE" && userLogued !== id) {
        return res.status(403).json({
            success: false,
            msg: "Solo tu puedes modificar tu cuenta"
        });
    }
    next()
}

// export const validateRole = async (req, res, next) => {
//     const { id } = req.params;
//     const userLogued = req.usuario.id;
//     const role = req.usuario.role;
    
//     if (role != "ADMIN_ROLE" && userLogued !== id) {
//         return res.status(400).json({
//             success: false,
//             msg: "No tienes permisos para realizar esta acción"
//         })
//     }
//     next()
// }

export const generateUniqueAccountNumber = async () => {
    let accountNumber;
    let exists = true;

    do {
        accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        exists = await User.exists({ noAccount: accountNumber });
    } while (exists);

    return accountNumber;
}

export const validateAdmin = (req, res, next) => {
    const { role } = req.usuario || {};

    if (role !== 'ADMIN_ROLE') {
        return res.status(403).json({
            success: false,
            msg: 'No estás autorizado para realizar esta acción'
        });
    }

    next();
};

export const confirmDeletionValidation = (req, res, next) => {
    const { confirm } = req.body;

    if (!confirm) {
        return res.status(400).json({
            success: false,
            msg: 'Confirm is required'
        }); 
    }
    next();
};
