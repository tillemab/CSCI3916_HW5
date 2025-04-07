const express = require('express')
const router = express.Router();
const User = require('../collection/Users');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => { // Use async/await
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

module.exports = router