var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Schema Setup
var coursesSchema = new mongoose.Schema({
    name: String,
    imagePath: String, 
    description: String,
    author: String,
    categories: String,
    difficulty: String,
    imageType: String,
    uploadDate: String,
    imageID: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course.file"
        }
    }
});

module.exports = mongoose.model("Course", coursesSchema);