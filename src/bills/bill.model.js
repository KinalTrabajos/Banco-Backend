import { Schema, model } from "mongoose";

const BillSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    numeroFactura: {
        type: String,
        required: true,
        unique: true
    },
    total: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model("Bill", BillSchema);