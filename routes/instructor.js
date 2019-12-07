var express  = require("express"),
    mongoose = require("mongoose"),
    router   = express.Router(),
    Course   = require("../models/courses");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var uri = "mongodb://localhost/young_hack";
var conn = mongoose.createConnection(uri, { useNewUrlParser: true });

var crypto = require("crypto"),
multer = require("multer"),
GridFsStorage = require("multer-gridfs-storage"),
Grid = require("gridfs-stream"),
path = require("path");


//GFS Init
let gfs;
conn.once('open', function(){
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("Course");
});

var storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'Course'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  var upload = multer({ storage });

// =====================
//  Instructor Routes
// =====================
// INDEX Page route
router.get("/instructor", function(req, res){
    console.log(gfs.files);
    gfs.files.find().toArray((err, files) => {
        //Check Files
        res.render("admin", {files: files});
    });
});

// UPLOAD Image route
router.post("/instructor/upload", upload.single("file"), function(req, res){
    var newCourse = new Course({
        name: req.body.courseName,
        imagePath: req.file.filename,
        description: req.body.description,
        author: req.body.author,
        categories: req.body.categories,
        difficulty: req.body.difficulty,
        imageType: req.file.contentType,
        uploadDate: req.file.uploadDate,
        imageID: req.file.id
    });
    Course.create(newCourse, function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/instructor");
        }
    });
    
});

// SHOW Files route
router.get("/instructor/files", function(req, res){
    gfs.files.find().toArray((err, files) => {
        //Check Files
        if(!files || files.length === 0)
        {
            return res.status(404).json({
                err: "No File Exists"
            });
        }

        //If Exists
        return res.json(files);
    });
});

// SHOW Selected Files route
router.get("/instructor/files/:filename", function(req, res){
    gfs.files.findOne({filename: req.params.filename}, function(err, file){
         //Check Files
         if(!file || file.length === 0)
         {
             return res.status(404).json({
                 err: "No File Exists"
             });
         }

         return res.json(file);
    });
});

// SHOW Image Route
router.get("/instructor/image/:filename", function(req, res){
    gfs.files.findOne({filename: req.params.filename}, function(err, file){
        //Check Files
        if(!file || file.length === 0)
        {
            return res.status(404).json({
                err: "No File Exists"
            });
        }

        if(file.contentType === "image/jpeg" || file.contentType === "image/png")
        {
            var readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
        else{
            res.status(404).json({
                err: "Not an image"
            });
        }
   });
});

module.exports = router;