const errorMessages = {
    // General
    serverError: 'Internal server error',
    invalidRequest: 'Invalid request',

    // Message-related
    messageNotFound: 'Message not found',
    messageTooShort: 'Message must be at least 1 character long',
    messageTooLong: 'Message cannot exceed 200 characters',
    authorTooLong: 'Author name cannot exceed 50 characters',

    // File-related
    invalidFileFormat: 'Invalid format. Valid formats: JPG, PNG, WEBP, MP4, MP3',

    // Reaction-related
    reactionNotFound: 'Reaction not found',

    // Success messages
    likeSuccess: 'Liked successfully',
    deleteSuccess: 'Deleted successfully',
};
export default errorMessages;
