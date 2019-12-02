var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Schema setup
var newsletterSchema = new mongoose.Schema({
    email: String
});

module.exports = mongoose.model("Newsletter", newsletterSchema);