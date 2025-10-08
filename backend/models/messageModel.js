import mongoose from 'mongoose'; //import statement: ODM (object data modeling) to create models and define schemes, connects us to MongoDB, database

//Bulding a schema defining rules
const messageSchema = new mongoose.Schema({
    author: { type: String, required: true, minlength: 1 },
    text: { type: String, required: true, minlength: 1 },
    likes: { type: Number, default: 0 },
    attachments: [
        {
            type: {
                type: String, // e.g. "image", "video", "audio"
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema); // exporting a Mongoose model called "Message" that uses the messageSchema

