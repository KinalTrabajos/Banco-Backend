import Account from '../account/account.model.js';

export const validateTransfer = async (req, res, next) => {
    try {
        const fromUser = req.usuario._id;
        const { toAccount, amount } = req.body;

        if (!toAccount || !amount) {
            return res.status(400).json({ msg: 'toAccount and amount are required' });
        }

        const senderAccount = await Account.findOne({ keeperUser: fromUser });
        if (!senderAccount) {
            return res.status(404).json({ msg: 'Sender account not found' });
        }

        const receiverAccount = await Account.findOne({ noAccount: toAccount });
        if (!receiverAccount) {
            return res.status(404).json({ msg: 'Recipient account not found' });
        }

        if (senderAccount.noAccount === toAccount) {
            return res.status(400).json({ msg: 'You cannot transfer to your own account' });
        }

        const commissionPercentage = 3.5;
        const commissionAmount = (amount * commissionPercentage) / 100;
        const totalToDeduct = amount + commissionAmount;

        if (senderAccount.balance < totalToDeduct) {
            return res.status(400).json({ msg: 'Insufficient balance to cover amount and commission' });
        }

        req.senderAccount = senderAccount;
        req.receiverAccount = receiverAccount;
        req.commissionAmount = commissionAmount;

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error validating transfer' });
    }
};
