/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/mp3/'); // Directory where MP3 files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter for MP3 only
// const fileFilter = (req: any, file: any, cb: any) => {
//   if (
//     file.mimetype === 'audio/mpeg' ||
//     file.mimetype === 'audio/mp3' ||
//     file.mimetype === 'audio/x-m4a' ||
//     file.mimetype === 'audio/m4a'
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only MP3 files are allowed!'), false);
//   }
// };

const uploadMp3 = multer({
  storage,
  //   fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});
export default uploadMp3;
