export const validateAccountQuery = (req, res, next) => {
    const { noAccount, dpi } = req.query;

    if (!noAccount && !dpi) {
        return res.status(400).json({
            success: false,
            msg: 'Debe proporcionar al menos noAccount o dpi como parámetro de búsqueda'
        });
    }

    if (dpi && dpi.length !== 13) {
        return res.status(400).json({
            success: false,
            msg: 'El DPI debe tener exactamente 13 caracteres'
        });
    }

    next();
};