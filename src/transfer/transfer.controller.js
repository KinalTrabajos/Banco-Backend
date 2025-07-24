import Transfer from "./transfer.model.js";
import History from "../history/history.model.js"
import Account from "../account/account.model.js";

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

        await Account.findOneAndUpdate(
            { noAccount: toAccount },
            { $inc: { countTransactions: 1 } },
            { new: true }
        );

        const historyEntry = new History({
            fromUser,
            toUser: receiverAccount.keeperUser,
            amount,
            description,
            transfer: newTransfer._id
        });

        await historyEntry.save();

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

export const updateTransfer = async (req, res) => {
    try {
        const { toAccount, amount, description } = req.body;
        const transfer = req.transfer;

        const senderAccount = req.senderAccount;
        const oldReceiverAccount = req.oldReceiverAccount;
        const newReceiverAccount = req.newReceiverAccount;
        const originalCommission = req.originalCommission;
        const newAmount = req.newAmount;
        const newCommission = req.newCommission;
        const totalToDeduct = req.totalToDeduct;

        senderAccount.balance += transfer.amount + originalCommission;
        oldReceiverAccount.balance -= transfer.amount;

        senderAccount.balance -= totalToDeduct;
        newReceiverAccount.balance += newAmount;

        await Promise.all([
            senderAccount.save(),
            oldReceiverAccount.save(),
            newReceiverAccount._id.toString() !== oldReceiverAccount._id.toString() ? newReceiverAccount.save() : null
        ].filter(Boolean)); 

        let updated = false;
        if (toAccount !== undefined && toAccount !== transfer.toAccount.toString()) {
            transfer.toAccount = toAccount;
            updated = true;
        }
        if (amount !== undefined && amount !== transfer.amount) {
            transfer.amount = amount;
            updated = true;
        }
        if (description !== undefined && description !== transfer.description) {
            transfer.description = description;
            updated = true;
        }

        if (updated) {
            await transfer.save();
        }

        res.status(200).json({
            msg: 'Transfer updated successfully',
            transfer,
            commissionCharged: newCommission.toFixed(2)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error updating transfer' });
    }
};

export const cancelTransfer = async (req, res) => {
    try {
        const transfer = req.transfer; 
        const userId = req.usuario._id;

        const senderAccount = await Account.findOne({ keeperUser: userId });
        const receiverAccount = await Account.findOne({ noAccount: transfer.toAccount });

        const commissionAmount = (transfer.amount * 3.5) / 100;
        const totalRefund = transfer.amount + commissionAmount;

        senderAccount.balance += totalRefund;
        receiverAccount.balance -= transfer.amount;

        await Promise.all([
            senderAccount.save(),
            receiverAccount.save(),
            Transfer.findByIdAndDelete(transfer._id),
            History.deleteOne({ transfer: transfer._id })
        ]);

        res.status(200).json({ msg: 'Transfer successfully cancelled and funds reverted' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error cancelling transfer' });
    }
};