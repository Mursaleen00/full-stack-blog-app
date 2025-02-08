const mongoose = require("mongoose");

function ConnectToDB() {
  mongoose.connect(process.env.MONGO_URI);
}

module.exports = ConnectToDB;
