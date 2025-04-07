require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');

const signup = require('./route/signup')
const signin = require('./route/signin')
const movies = require('./route/movies')
const reviews = require('./route/reviews')

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/signup', signup);
app.use('/signin', signin);
app.use('/movies', movies);
app.use('/reviews', reviews);
app.use('/', express.Router());

const PORT = process.env.PORT || 8080; // Define PORT before using it
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // for testing only