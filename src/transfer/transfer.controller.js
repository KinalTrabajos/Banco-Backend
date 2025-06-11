import Transfer from "./transfer.model.js";

export const createTransfer = async (req, res) => {
    try {
        const fromUser = req.usuario._id;
        const { toAccount, amount, description } = req.body;

        const senderAccount = req.senderAccount;
        const receiverAccount = req.receiverAccount;
        const commissionAmount = req.commissionAmount || 0;

        const totalToDeduct = amount + commissionAmount;

        senderAccount.balance -= totalToDeduct;
        receiverAccount.balance += amount;

        await senderAccount.save();
        await receiverAccount.save();

        const newTransfer = new Transfer({
            fromUser,
            toAccount,
            amount,
            description
        });

        await newTransfer.save();

        res.status(201).json({
            msg: 'Transfer completed successfully',
            transfer: newTransfer,
            commissionCharged: commissionAmount.toFixed(2)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error processing transfer' });
    }
};
