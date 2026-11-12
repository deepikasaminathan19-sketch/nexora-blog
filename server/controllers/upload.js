import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (r, f, cb) => cb(f.mimetype.startsWith('image/') ? null : new Error('Only images allowed'), f.mimetype.startsWith('image/')) });
export async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file sent' });
    const url = await new Promise((ok, fail) => cloudinary.uploader.upload_stream({ folder: 'nexora' }, (e, r) => e ? fail(e) : ok(r.secure_url)).end(req.file.buffer));
    res.status(201).json({ url });
  } catch (e) { next(e); }
}
