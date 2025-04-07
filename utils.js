const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.DB);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1); // Exit the process if the connection fails (optional)
    }
};

const concatenateErrors = (err) => {

  let message = "";

  // Add the error message for each path
  const errors = Object.values(err["errors"]);
  for (let i = 0; i < errors.length; i++ ) {
    message += errors[i]["message"] + " ";
  }

  // Splice off the last extra space character
  return message.slice(0, -1);

}

module.exports = {
    connectDB: connectDB,
    concatenateErrors: concatenateErrors
}