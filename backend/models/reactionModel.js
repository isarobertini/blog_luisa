import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
    author: { type: String, required: true, minlength: 1, maxlength: 150 },
    text: { type: String, maxlength: 150 }, // optional text comment
    like: { type: Boolean, default: false }, // true if it's a like
    message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Reaction', reactionSchema);
