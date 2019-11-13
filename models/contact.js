var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Schema setup
var contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    message: String
});

module.exports = mongoose.model("Contact", contactSchema);