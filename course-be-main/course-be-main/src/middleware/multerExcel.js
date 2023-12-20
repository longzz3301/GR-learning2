// const multer = require('multer');
// const fs = require('fs-extra');
// const csv = require('csv-parser');
// // const public = require("../public/uploads")
// const path = require('path')

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         let dir = `./public/uploads`;
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir, { recursive: true });
//         }
//         cb(null, dir);
//     },
//     filename: function (req, file, cb) {
//         let ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
//         cb(null, file.fieldname + '-' + Date.now() + ext);
//     }
// });





// var uploads = multer({storage:storage})
// module.exports = uploads