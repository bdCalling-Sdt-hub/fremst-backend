import { Request } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import ApiError from '../../errors/ApiError';

const fileUploadHandler = () => {
  //create upload folder
  const baseUploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  //folder create for different file
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  //create filename
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
      switch (file.fieldname) {
        case 'image':
          uploadDir = path.join(baseUploadDir, 'images');
          break;
        case 'profile':
          uploadDir = path.join(baseUploadDir, 'profiles');
          break;
        case 'stepImage':
          uploadDir = path.join(baseUploadDir, 'stepImage');
          break;
        case 'inspectionImage':
          uploadDir = path.join(baseUploadDir, 'inspectionImages');
          break;

        case 'media':
          uploadDir = path.join(baseUploadDir, 'medias');
          break;
        case 'pdfReport':
          uploadDir = path.join(baseUploadDir, 'pdfReports');
          break;
        case 'doc':
          uploadDir = path.join(baseUploadDir, 'docs');
          break;
        default:
          throw new ApiError(StatusCodes.BAD_REQUEST, 'File is not supported');
      }
      createDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  //file filter
  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (
      file.fieldname === 'image' ||
      file.fieldname === 'stepImage' ||
      file.fieldname === 'inspectionImage' ||
      file.fieldname === 'profile'
    ) {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .jpeg, .png, .jpg file supported'
          )
        );
      }
    } else if (file.fieldname === 'media') {
      if (file.mimetype === 'video/mp4' || file.mimetype === 'audio/mpeg') {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .mp4, .mp3, file supported'
          )
        );
      }
    } else if (file.fieldname === 'doc' || file.fieldname === 'pdfReport') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new ApiError(StatusCodes.BAD_REQUEST, 'Only pdf supported'));
      }
    } else {
      cb(new ApiError(StatusCodes.BAD_REQUEST, 'This file is not supported'));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: filterFilter,
  }).fields([
    { name: 'image', maxCount: 3 },
    { name: 'stepImage', maxCount: 1 },
    { name: 'inspectionImage', maxCount: 1 },
    { name: 'media', maxCount: 3 },
    { name: 'pdfReport', maxCount: 1 },
    { name: 'profile', maxCount: 1 },
    { name: 'doc', maxCount: 3 },
  ]);
  return upload;
};

export default fileUploadHandler;
