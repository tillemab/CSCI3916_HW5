const mongoose = require('mongoose');
const { connectDB } = require('../utils')

connectDB();

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "You must provide a title."],
        index: true
    },
    releaseDate: { 
        type: Number, 
        required: [true, "You must provide a releaseDate."],
        min: [1900, 'The releaseDate must be greater than 1899.'], 
        max: [2100, 'The releaseDate must be less than 2100.']
    },
    genre: {
        type: String,
        required: [true, "You must provide a genre."],
        enum: {
            values: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'],
            message: "Invalid genre! Valid genres: Action, Adventure, Comedy, Drama, Fantasy, Horror, Mystery, Thriller, Western, Science Fiction."
        },
    },
    actors: {
        type: [{
            actorName: String,
            characterName: String,
        }],
        required: [true, "You must provide actors."],
    },
    imageUrl: {
        type: String,
        required: [true, "You must provide an image URL."]
    }
});

module.exports = mongoose.model('Movie', MovieSchema);