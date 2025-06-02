import multer from 'multer';
import path from 'path';
const filePath = './public/uploads/images/';
import fs from 'fs';

const fileUpload = (fileDirectory: string) => {
  if (!fs.existsSync(fileDirectory)) {
    fs.mkdirSync(filePath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, fileDirectory);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.originalname + '_' + Date.now() + path.extname(file.originalname),
      );
    },
  });
  const upload = multer({ storage: storage });
  return upload;
};

export default fileUpload;
