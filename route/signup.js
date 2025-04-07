const express = require('express')
const router = express.Router();
const User = require('../collection/Users');

router.post('/', async (req, res) => { // Use async/await
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

module.exports = router