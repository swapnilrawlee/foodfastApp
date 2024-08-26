const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodb");

} catch (error) {
    console.log("mongoose db  error" + error);

}

module.exports = mongoose.connection;

