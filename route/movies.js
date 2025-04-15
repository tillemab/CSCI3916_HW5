const express = require('express')
const router = express.Router();
const Movie = require('../collection/Movies');
const authJwtController = require('../auth_jwt');
const mongoose = require('mongoose');
const { concatenateErrors } = require('../utils');

// Retrieves all of the movies (requires JWT token)
router.get('/', authJwtController.isAuthenticated, async (req, res) => {
    if(req.query.reviews === "true") {
        Movie.aggregate([
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "movieId",
                    as: "movieReviews"
                }
            },
            {
                $addFields: {
                    avgRating: {
                        $cond: {
                            if: { $gt: [ { $size: "$reviews" }, 0 ] },
                            then: { $avg: "$reviews.rating" },
                            else: null
                        }
                    }
                }
            },
            {
                $sort: {
                    avgRating: -1
                }
            }
        ])
            .then((results) => {
                res.status(200).send(results); // 200 Okay
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
            });
    } else {
        Movie.find()
            .then((results) => {
                res.status(200).send(results); // 200 Okay
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
            });
    };
});

// Create a new movie (requires JWT token)
router.post('/', authJwtController.isAuthenticated, async (req, res) => {
    Movie.create({
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        genre: req.body.genre,
        actors: req.body.actors,
        imageUrl: req.body.imageUrl
    })
        .then((results) => {
            res.status(201).json({ success: true, movie: results }); // 201 Created
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                res.status(400).json({ success: false, message: concatenateErrors(err) }); // 400 Bad Request
            } else {
                res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
            }
        });
});

// PUT Method Unsupported without ID
router.put('/', authJwtController.isAuthenticated, async (req, res) => {
    res.status(405).json({ success: false, message: 'PUT not allowed on /movies route. Use /movies/:movieId instead.' }); // 405 Method Not Found
});

// DELETE Method Unsupported without ID
router.delete('/', authJwtController.isAuthenticated, async (req, res) => {
    res.status(405).json({ success: false, message: 'DELETE not allowed on /movies route. Use /movies/:movieId instead.' }); // 405 Method Not Found
});

// Remainder of Unsupported HTTP Methods
router.all('/', authJwtController.isAuthenticated, (req, res) => {
    res.status(405).send({ success: false, message: 'HTTP method not supported.' }); // 405 Method Not Found
});

// Retrieves a specific movie (requires JWT token)
router.get('/:movieId', authJwtController.isAuthenticated, async (req, res) => {
    if(req.query.reviews === "true") {
        Movie.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.movieId) }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "movieId",
                    as: "movieReviews"
                }
            },
            {
                $addFields: {
                    avgRating: {
                        $cond: {
                            if: { $gt: [ { $size: "$reviews" }, 0 ] },
                            then: { $avg: "$reviews.rating" },
                            else: null
                        }
                    }
                }
            }
        ])
            .then((results) => {
                if (results.length !== 0) {
                    res.status(200).send({ success: true, movie: results[0] }); // 200 OK
                } else {
                    res.status(404).send({ success: false, message: 'Movie not found.' }); // 404 Not Found
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
            });
    } else {
        Movie.findById(req.params.movieId)
            .then((results) => {
                if (results) {
                    res.status(200).send({ success: true, movie: results }); // 200 OK
                } else {
                    res.status(404).send({ success: false, message: 'Movie not found.' }); // 404 Not Found
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Server Error
            })
    };
});

// POST Method Unsupported with ID
router.post('/:movieId', authJwtController.isAuthenticated, async (req, res) => {
    res.status(405).json({ success: false, message: 'POST not allowed on /movies/:movieId route. Use /movies instead.' }); // 405 Method Not Allowed
});

// Update an existing movie (requires JWT token)
router.put('/:movieId', authJwtController.isAuthenticated, async (req, res) => {
    Movie.findOneAndReplace({_id: req.params.movieId}, {
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        genre: req.body.genre,
        actors: req.body.actors,
        imageUrl: req.body.imageUrl
    }, {runValidators: true})
        .then((results) => {
            if (results) {
                res.status(200).send({ success: true, message: 'Movie updated.' }); // 200 OK
            } else {
                res.status(404).send({ success: false, message: 'Movie does not exist.' }); // 404 Not Found
            }

        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                res.status(400).json({ success: false, message: concatenateErrors(err) }); // 400 Bad Request
            } else {
                res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
            }
        });
});

// Delete a specific movie (requires JWT token)
router.delete('/:movieId', authJwtController.isAuthenticated, async (req, res) => {
    Movie.findByIdAndDelete(req.params.movieId)
        .then((results) => {
            if (results) {
                res.status(200).send({ success: true, message: 'Movie deleted.' }); // 200 OK
            } else {
                res.status(404).send({ success: false, message: 'Movie not found.' }); // 404 Not Found
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Server Error
        })
});

// Remainder of Unsupported HTTP Methods
router.all('/:movieId', authJwtController.isAuthenticated, (req, res) => {
    res.status(405).send({ success: false, message: 'HTTP method not supported.' }); // 405 Method Not Found
});

module.exports = router