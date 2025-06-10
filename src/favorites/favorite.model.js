import { Schema, model } from 'mongoose';

const FavoriteSchema = new Schema({
    owner: { // el usuario autenticado que guarda el favorito
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    target: { // la cuenta marcada como favorita
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    alias: {
        type: String,
        trim: true
    },
    isFavorite: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

FavoriteSchema.index({ owner: 1, target: 1 }, { unique: true });

export default model('Favorite', FavoriteSchema);
