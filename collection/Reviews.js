const mongoose = require('mongoose');
const { connectDB } = require('../utils');
const Movies = require('./Movies');

connectDB();

const ReviewSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "You must provide the movieId of what you are reviewing."],
        ref: 'Movie',
        validate: {
            validator: async (value) => {
                const movie = await Movies.findById(value)
                return movie !== null;
            },
            message: "A movie with that ID was not found."
        }
    },
    username: {
        type: String,
        required: [true, "You must provide a username."]
    },
    review: {
        type: String,
        required: [true, "You must provide a review."]
    },
    rating: {
        type: Number,
        required: [true, "You must provide a rating from 0 to 5!"],
        min: [0, "The rating must be between 0 to 5!"],
        max: [5, "The rating must be between 0 to 5!"]
    }
});

module.exports = mongoose.model('Review', ReviewSchema);