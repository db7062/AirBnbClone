const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://bookings:debjeet1234@cluster0.3jgzvm2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log("C0nnected to Mongo Yeahhhh");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;