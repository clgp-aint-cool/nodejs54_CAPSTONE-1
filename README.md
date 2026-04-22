# Image Gallery - Fullstack Application

Ứng dụng quản lý ảnh hoàn chỉnh với Node.js/Express backend và React TypeScript frontend.

## Project Structure

```
├── backend/          # Express.js API server
│   ├── src/
│   ├── prisma/
│   ├── uploads/
│   ├── documentation/
│   └── server.js
├── frontend/         # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── ...
└── README.md
```

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# (Optional) Seed database with demo data
npm run prisma:seed

# Start development server
npm run dev
```

Backend sẽ chạy tại: **http://localhost:3069**
API Docs: **http://localhost:3069/api-docs**

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env
# Edit VITE_API_URL if backend runs on different port

# Start development server
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3000** (hoặc port được Vite chọn)

### 3. Demo Credentials

Nếu chạy seed:
```
Email: demo@example.com
Password: demo123
```

## Features

### Authentication
- User registration with email, password, name, age
- JWT-based authentication
- Protected routes
- Auto logout on token expiration

### Images
- Upload images (JPEG, PNG, GIF, WebP, max 5MB)
- View all images with search
- View image details with comments
- Delete own images
- Pagination support

### Comments
- Add comments to images
- View all comments for an image
- Delete own comments
- Real-time display

### Saved Images
- Save/unsave images
- View saved collection
- Check if image is saved
- Pagination support

### User Profile
- View own profile
- Edit profile (name, age, avatar URL)
- View created images
- View saved images
- Separate tabs for created/saved

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Images
- `GET /api/images?page&limit&search`
- `GET /api/images/:id`
- `POST /api/images` (multipart)
- `DELETE /api/images/:id`

### Users
- `GET /api/users`
- `PUT /api/users`
- `GET /api/users/images/created`
- `GET /api/users/images/saved`

### Comments
- `GET /api/comments/image/:imageId`
- `POST /api/comments/image/:imageId`
- `DELETE /api/comments/:commentId`

### Saved
- `GET /api/saved/check/:imageId`
- `POST /api/saved/:imageId`
- `DELETE /api/saved/:imageId`
- `GET /api/saved`

## Tech Stack

### Backend
- Node.js + Express
- TypeScript with tsx
- Prisma ORM
- MySQL Database
- JWT Authentication
- Multer (file upload)
- Swagger UI
- WebSocket (ws)

### Frontend
- React 18
- TypeScript
- Vite
- React Router v6
- Axios
- Tailwind CSS
- Lucide React Icons

## Database Schema

### nguoi_dung (User)
- nguoi_dung_id (PK)
- email (unique)
- mat_khau (hashed)
- ho_ten
- tuoi
- anh_dai_dien
- created_at, updated_at

### hinh_anh (Image)
- hinh_id (PK)
- ten_hinh
- duong_dan
- mo_ta
- nguoi_dung_id (FK)
- created_at, updated_at

### binh_luan (Comment)
- binh_luan_id (PK)
- noi_dung
- nguoi_dung_id (FK)
- hinh_id (FK)
- created_at, updated_at

### luu_anh (Saved Image)
- Composite PK: (nguoi_dung_id, hinh_id)
- ngay_luu, created_at, updated_at

## Testing

### Manual Testing with cURL

```bash
# Register
curl -X POST http://localhost:3069/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","ho_ten":"Test User","tuoi":25}'

# Login
curl -X POST http://localhost:3069/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Upload image (replace TOKEN with JWT)
curl -X POST http://localhost:3069/api/images \
  -H "Authorization: Bearer TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "ten_hinh=My Photo" \
  -F "mo_ta=Description"
```

### Postman Collection

Import: `backend/documentation/Image_Gallery_API_Postman_Collection.json`

## Troubleshooting

**CORS Errors**: Ensure backend CORS is configured for your frontend URL

**Upload Fails**: Check file size (< 5MB) and type (JPEG, PNG, GIF, WebP)

**401 Unauthorized**: Token expired or not sent. Login again.

**Database Connection**: Verify MySQL is running and DATABASE_URL is correct

## Development Notes

- Backend uses ES Modules (`type: "module"` in package.json)
- Prisma 7.x with new config format (prisma.config.ts)
- Images stored in `backend/uploads/` folder
- JWT secret should be changed in production
- All timestamps are UTC

## Future Enhancements

- [ ] Google OAuth login
- [ ] Image compression/resizing
- [ ] Cloud storage (S3/Cloudinary)
- [ ] Real-time notifications via WebSocket
- [ ] Like system
- [ ] Categories/tags
- [ ] Follow system
- [ ] Infinite scroll
- [ ] Image editing
- [ ] Email notifications

## License

ISC
