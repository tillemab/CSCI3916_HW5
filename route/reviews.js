const express = require('express');
const router = express.Router();
const Review = require('../collection/Reviews');
const authJwtController = require('../auth_jwt');
const { concatenateErrors } = require('../utils');

// Retrieve all of the reviews
router.get('/', async (req, res) => {
    Review.find()
        .then((results) => {
            res.status(200).send(results) // 200 Okay
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
        });
});

// Create a new review (requires JWT token)
router.post('/', authJwtController.isAuthenticated, async (req, res) => {
    Review.create({
        movieId: req.body.movieId,
        username: req.user.name,
        review: req.body.review,
        rating: req.body.rating,
    })
        .then((results) => {
            res.status(201).json({ success: true, review: results }); // 201 Created
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                res.status(400).json({ success: false, message: concatenateErrors(err) }); // 400 Bad Request
            } else {
                res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
            }
        });
});

// Unsupported HTTP Methods
router.all('/', (req, res) => {
    res.status(405).send({ success: false, message: 'HTTP method not supported.' }); // 405 Method Not Found
});

module.exports = router;