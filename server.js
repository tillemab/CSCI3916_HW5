require('dotenv').config();
const express = require('express');
const ObjectId = require('mongodb')
const bodyParser = require('body-parser');
const passport = require('passport');
const authJwtController = require('./auth_jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./Users');
const Movie = require('./Movies');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

const router = express.Router();

router.post('/signup', async (req, res) => { // Use async/await
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ success: false, msg: 'Please include both username and password to signup.' }); // 400 Bad Request
  }

  try {
    const user = new User({ // Create user directly with the data
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });

    await user.save(); // Use await with user.save()

    res.status(201).json({ success: true, msg: 'Successfully created new user.' }); // 201 Created
  } catch (err) {
    if (err.code === 11000) { // Strict equality check (===)
      return res.status(409).json({ success: false, message: 'A user with that username already exists.' }); // 409 Conflict
    } else {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
    }
  }
});

router.post('/signin', async (req, res) => { // Use async/await
  try {
    const user = await User.findOne({ username: req.body.username }).select('name username password');

    if (!user) {
      return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' }); // 401 Unauthorized
    }

    const isMatch = await user.comparePassword(req.body.password); // Use await

    if (isMatch) {
      const userToken = { id: user._id, username: user.username }; // Use user._id (standard Mongoose)
      const token = jwt.sign(userToken, process.env.SECRET_KEY, { expiresIn: '1h' }); // Add expiry to the token (e.g., 1 hour)
      res.json({ success: true, token: 'JWT ' + token });
    } else {
      res.status(401).json({ success: false, msg: 'Authentication failed. Incorrect password.' }); // 401 Unauthorized
    }
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
  }
});

router.route('/movies')
  .get(authJwtController.isAuthenticated, async (req, res) => {

    // Retrieves all movies in the collection
    Movie.find()
      .then((results) => {

        // Return 200 Okay
        res.status(200).send(results)

      })
      .catch((err) => {

        console.error(err);

        // 500 Internal Server Error
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });

      })

  })
  .post(authJwtController.isAuthenticated, async (req, res) => {

    // Check that request has the necessary information (400 Bad Request)
    if (!req.body.title || !req.body.releaseDate || !req.body.genre || !req.body.actors) {
      return res.status(400).json({ success: false, message: 'You must provide a title, releaseDate, genre, and actors!' }) 
    }

    // Check that the releaseDate is greater than or equal to the min (400 Bad Request)
    if (req.body.releaseDate < Movie.schema.path('releaseDate').options.min[0]) {
      return res.status(400).json({ success: false, message: `Issue with releaseDate! ${Movie.schema.path('releaseDate').options.min[1]}.` }) 
    }

    // Check that the releaseDate is less than or equal to the max (400 Bad Request)
    if (req.body.releaseDate > Movie.schema.path('releaseDate').options.max[0]) {
      return res.status(400).json({ success: false, message: `Issue with releaseDate! ${Movie.schema.path('releaseDate').options.max[1]}.` }) 
    }

    // Check that the genre is valid (400 Bad Request)
    if (!Movie.schema.path('genre').enumValues.includes(req.body.genre)) {
      return res.status(400).json({ success: false, message: `Issue with genre! Valid options are ${Movie.schema.path('genre').enumValues.join(', ')}.` });
    }

    // Create new movie directly with the data
    const movie = new Movie({
      title: req.body.title,
      releaseDate: req.body.releaseDate,
      genre: req.body.genre,
      actors: req.body.actors
    })

    // Save movie to the collection
    movie.save()
      .then((results) => {

        // Return 201 Created
        res.status(201).json({ success: true, movie: results })

      })

      .catch((err) => {

        console.error(err);

        // 500 Internal Server Error
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });

      })

  })
  .put(authJwtController.isAuthenticated, async (req, res) => {
    res.status(405).json({ success: false, message: 'PUT not allowed on /movies. Use /movies/:movieId instead.' }); // 405 Method Not Found
  })
  .delete(authJwtController.isAuthenticated, async (req, res) => {
    res.status(405).json({ success: false, message: 'DELETE not allowed on /movies. Use /movies/:movieId instead.' }); // 405 Method Not Found
  })
  .all(authJwtController.isAuthenticated, (req, res) => {
    res.status(405).send({ success: false, message: 'HTTP method not supported.' }); // 405 Method Not Found
  });

router.route('/movies/:movieId')
    .get(authJwtController.isAuthenticated, async (req, res) => {
      Movie.findById(req.params.movieId)
        .then((results) => {

          if(results) {
            res.status(200).send({ success: true, movie: results }); // 200 OK
          } else {
            res.status(404).send({ success: false, message: 'Movie not found.' }); // 404 Not Found
          }

        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Server Error
        })
    })
    .post(authJwtController.isAuthenticated, async (req, res) => {
      res.status(405).json({ success: false, message: 'POST not allowed on /movies/:movieId. Use /movies instead.' }); // 405 Method Not Allowed
    })
    .put(authJwtController.isAuthenticated, async (req, res) => {

      // Check that request has the necessary information (400 Bad Request)
      if (!req.body.title || !req.body.releaseDate || !req.body.genre || !req.body.actors) {
        return res.status(400).json({ success: false, message: 'You must provide a title, releaseDate, genre, and actors!' }) 
      }

      // Check that the releaseDate is greater than or equal to the min (400 Bad Request)
      if (req.body.releaseDate < Movie.schema.path('releaseDate').options.min[0]) {
        return res.status(400).json({ success: false, message: `Issue with releaseDate! ${Movie.schema.path('releaseDate').options.min[1]}.` }) 
      }

      // Check that the releaseDate is less than or equal to the max (400 Bad Request)
      if (req.body.releaseDate > Movie.schema.path('releaseDate').options.max[0]) {
        return res.status(400).json({ success: false, message: `Issue with releaseDate! ${Movie.schema.path('releaseDate').options.max[1]}.` }) 
      }

      // Check that the genre is valid (400 Bad Request)
      if (!Movie.schema.path('genre').enumValues.includes(req.body.genre)) {
        return res.status(400).json({ success: false, message: `Issue with genre! Valid options are ${Movie.schema.path('genre').enumValues.join(', ')}.` });
      }

      const updated_movie = {
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        genre: req.body.genre,
        actors: req.body.actors
      }

      // Update the existing movie in the collection with updated movie
      Movie.findByIdAndUpdate(req.params.movieId, updated_movie)
        .then((results) => {

          if(results) {
            res.status(200).send({ success: true, message: 'Movie updated.' }); // 200 OK
          } else {
            res.status(404).send({ success: false, message: 'Movie not found.' }); // 404 Not Found
          }

        })
        .catch((err) => {

          console.error(err)
          
          // 500 Internal Server Error
          res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });

        })
    })
    .delete(authJwtController.isAuthenticated, async (req, res) => {
      Movie.findByIdAndDelete(req.params.movieId)
        .then((results) => {
          if(results) {
            res.status(200).send({ success: true, message: 'Movie deleted.' }); // 200 OK
          } else {
            res.status(404).send({ success: false, message: 'Movie not found.' }); // 404 Not Found
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Server Error
        })
    })
    .all(authJwtController.isAuthenticated, (req, res) => {
      res.status(405).send({ success: false, message: 'HTTP method not supported.' }); // 405 Method Not Found
    });

app.use('/', router);

const PORT = process.env.PORT || 8080; // Define PORT before using it
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // for testing only