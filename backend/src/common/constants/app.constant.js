import "dotenv/config";

export const DATABASE_URL = process.env.DATABASE_URL;
//ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;



export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const UPLOAD_PATH = process.env.UPLOAD_PATH || './uploads';
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5000000;

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

