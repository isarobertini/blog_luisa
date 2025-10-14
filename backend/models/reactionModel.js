import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
    author: { type: String, required: true, minlength: 1, maxlength: 150 },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, maxlength: 150 },
    like: { type: Boolean, default: false },
    message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Reaction', reactionSchema);
