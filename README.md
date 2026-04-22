
Backend  (Node.js + Express + Prisma) kết nối MySQL/MariaDB, cung cấp đầy đủ tính năng quản lý ảnh: đăng ký/đăng nhập, upload ảnh, bình luận, lưu ảnh yêu thích.

**Deployment:**
- **Frontend**: Vercel (React + Vite). Cần set `VITE_API_URL` trỏ đến Railway backend.
- **Backend**: Railway (Node.js). Cần set `DATABASE_URL` (MySQL connection từ Railway Database), `JWT_SECRET`, `CORS_ORIGIN` (domain Vercel). Railway gắn thêm thư mục `uploads` .


## Project Structure

```
├── backend/          # Express.js 
│   ├── src/
│   ├── prisma/
│   ├── uploads/
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

API Docs: **nodejs54capstone-1-production.up.railway.app/api-docs**

### Postman Collection
Cáptone API.postman_collection.json


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






