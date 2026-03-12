import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits:{
    fileSize: 50 * 1024 * 1024 // 50MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMines = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm']

    if (allowedMines.includes(file.mimetype)) {
      cb(null, true)
    }else{
      cb(new Error('Invalid file type. Only audio files allowed.'))
    }
  }
})