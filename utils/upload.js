const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req, 'Reqqq')
    cb(null, './uploads'); // Store uploads in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    console.log(file,'File')
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });

module.exports = upload;