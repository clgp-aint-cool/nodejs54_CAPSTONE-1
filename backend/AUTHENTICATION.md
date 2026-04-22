# Authentication System Documentation

## Overview
This API uses JWT (JSON Web Token) authentication with HTTP-only cookies for secure session management.

## Token Configuration

### Generated Secrets
- **ACCESS_TOKEN_SECRET**: `6e7eb1837eb411e929f95514e7cf9897e1004d14153ae038cb554c949e0c860e774547711e8eb927248a99c36ee5c1c170b5568f499e63fd15fad13ba6facd4e`
- **REFRESH_TOKEN_SECRET**: `46ee03c0c3613a18a16602095ae0bfd3e422cf4a662eb7997c0496be7acc4d657eea8c67765159e4088018445f70b741b8f10188389a9942bd2cc8c87c7ba67b`

These are stored in `.env` file and should be kept secret. Generate new ones for production.

### Token Expiry
- **Access Token**: 5 minutes (300 seconds)
- **Refresh Token**: 1 day (86400 seconds)

## Cookie Security

Cookies are set with the following security flags:
- `httpOnly`: Prevents JavaScript access (XSS protection)
- `secure`: Only sent over HTTPS in production
- `sameSite: strict`: Prevents CSRF attacks

## Authentication Flow

### 1. Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "ho_ten": "Nguyen Van A",
  "tuoi": 25
}
```
Response:
```json
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "user": {
      "nguoi_dung_id": 1,
      "email": "user@example.com",
      "ho_ten": "Nguyen Van A",
      "tuoi": 25,
      "anh_dai_dien": null
    }
  }
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```
**Note**: The server also sets `accessToken` and `refreshToken` as HTTP-only cookies.

### 3. Using Authenticated Endpoints

#### Option A: Cookie-based (Recommended for browser clients)
After login, cookies are automatically sent with subsequent requests to the same domain.

In Postman:
- Cookies are stored automatically
- No need to manually add Authorization header

#### Option B: Header-based (For API clients)
Extract the `accessToken` from login response and use:
```http
Authorization: Bearer <accessToken>
```

### 4. Refresh Token
When the access token expires (after 5 minutes), call the refresh endpoint:

```http
POST /api/auth/refresh
```
The server will:
- Read `refreshToken` from cookies
- Verify it's valid
- Issue new access token and refresh token
- Set them as new cookies

### 5. Logout
```http
POST /api/auth/logout
```
Clears both cookies from the browser.

## Protected Routes

All routes under `/api/*` (except auth routes) require authentication via:
- `Authorization: Bearer <token>` header, OR
- `accessToken` cookie

The `authenticateToken` middleware checks both sources.

## Testing with Postman

1. **Import** `postman-collection.json` into Postman
2. **Register** a new user or **Login** with existing credentials
3. After login, Postman will automatically store cookies
4. All subsequent requests will use the cookie-based authentication
5. If cookies aren't working, manually extract `accessToken` from login response and add to headers

## Security Notes

- Access tokens have a short expiry (5 minutes) to limit damage if stolen
- Refresh tokens have longer expiry (1 day) but are HTTP-only and can't be accessed by JavaScript
- Both tokens are signed with different secrets
- Always use HTTPS in production
- Consider implementing token rotation and blacklisting for enhanced security

## Common Issues

### 401 Unauthorized
- Token expired: Call `/api/auth/refresh`
- Invalid token: Re-login
- No token provided: Ensure cookies are enabled or Authorization header is set

### CORS with Credentials
When using cookies, the frontend must:
- Send `credentials: 'include'` in fetch/axios requests
- CORS must have `credentials: true` (already configured)

## File Upload

The image upload endpoint (`POST /api/images`) also uses cookie-based authentication.

**Form Data**:
- `image`: File (JPEG, PNG, GIF, WebP, max 5MB)
- `ten_hinh`: (optional) Image title
- `mo_ta`: (optional) Image description
