import AccountRequest from '../accountRequest/accountRequest.model.js'; 

export const validateAccountRequestStatusUpdate = async (req, res, next) => {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    try {
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid status. Status must be "approved" or "rejected".'
            });
        }

        const requestAccount = await AccountRequest.findById(id);

        if (!requestAccount) {
            return res.status(404).json({
                success: false,
                msg: 'Account request not found.'
            });
        }

        if (requestAccount.status !== 'pending') {
            return res.status(400).json({
                success: false,
                msg: 'Account request has already been processed.'
            });
        }

        req.requestAccount = requestAccount;
        next(); 
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error validating account request status update.',
            error: error.message
        });
    }
};