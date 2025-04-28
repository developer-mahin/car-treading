/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import convert from 'heic-convert';
import { NextFunction, Request, Response } from 'express';
import { Buffer } from 'buffer';

// Define MulterFile type
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

// Convert a single HEIC file to PNG
const convertHeicFileToPng = async (
  file: MulterFile,
  UPLOADS_FOLDER: string,
): Promise<void> => {
  try {
    const heicBuffer = await fs.promises.readFile(file.path);
    const pngArrayBuffer = await convert({
      buffer: heicBuffer,
      format: 'PNG',
    });

    // Convert ArrayBuffer to Buffer
    const pngBuffer = Buffer.from(pngArrayBuffer);

    const originalFileName = path.basename(
      file.originalname,
      path.extname(file.originalname),
    );
    const currentDateTime = new Date()
      .toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '');
    const pngFileName = `${originalFileName}_${currentDateTime}.png`;
    const pngFilePath = path.join(UPLOADS_FOLDER, pngFileName);

    await fs.promises.writeFile(pngFilePath, pngBuffer);
    await fs.promises.unlink(file.path); // Remove original HEIC file

    // Update file properties
    file.filename = pngFileName;
    file.path = pngFilePath;
    file.mimetype = 'image/png'; // Update MIME type
  } catch (error) {
    console.error('Error converting HEIC file:', error);
    throw new Error('Internal server error during HEIC conversion');
  }
};

// Middleware for HEIC to PNG conversion
const convertHeicToPng = (UPLOADS_FOLDER: string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Convert single HEIC file
      if (
        req.file &&
        ['image/heic', 'image/heif'].includes(req.file.mimetype)
      ) {
        await convertHeicFileToPng(req.file as MulterFile, UPLOADS_FOLDER);
      }

      // Convert multiple HEIC files if req.files is present
      if (req.files) {
        const files = req.files as { [fieldname: string]: MulterFile[] };

        for (const field in files) {
          for (const file of files[field]) {
            if (['image/heic', 'image/heif'].includes(file.mimetype)) {
              await convertHeicFileToPng(file, UPLOADS_FOLDER);
            }
          }
        }
      }

      next();
    } catch (error: any) {
      console.error('HEIC conversion middleware error:', error);
      res
        .status(500)
        .json({ error: error.message || 'HEIC conversion failed' });
    }
  };
};

export default convertHeicToPng;
