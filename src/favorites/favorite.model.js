import { Schema, model } from 'mongoose';

const FavoriteSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    favoriteAccount: {
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

FavoriteSchema.index({ account: 1, favoriteAccount: 1 }, { unique: true });

export default model('Favorite', FavoriteSchema);
