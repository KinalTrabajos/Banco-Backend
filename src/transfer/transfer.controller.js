import Transfer from "./transfer.model.js";

export const createTransfer = async (req, res) => {
    try {
        const fromUser = req.usuario._id;
        const { toAccount, amount, description } = req.body;

        const senderAccount = req.senderAccount;
        const receiverAccount = req.receiverAccount;

        senderAccount.balance -= amount;
        receiverAccount.balance += amount;

        await senderAccount.save();
        await receiverAccount.save();

        const newTransfer = new Transfer({
            fromUser,
            toAccount,
            amount,
            description,
        });

        await newTransfer.save();

        res.status(201).json({
            msg: "Transfer completed successfully",
            transfer: newTransfer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error processing transfer" });
    }
};
