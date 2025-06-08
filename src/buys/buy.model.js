import { Schema, model } from "mongoose";

const BuySchema = new Schema({
    keeperUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            name: { type: String },
            quantity: { type: Number, min: 1 },
            price: { type: Number, min: 0 },
        },
    ],
    totalTransaccion: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: Boolean,
        default: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default model("Buy", BuySchema);