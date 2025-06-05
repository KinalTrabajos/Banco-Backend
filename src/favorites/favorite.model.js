import { Schema, model } from 'mongoose';

const FavoriteSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    favoriteUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isFavorite: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

FavoriteSchema.index({ user: 1, favoriteUser: 1 }, { unique: true });

export default model('Favorite', FavoriteSchema);
