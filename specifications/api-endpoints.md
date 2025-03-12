# API Endpoint Specification

This document outlines the API endpoints for the second-hand store application.

## API Overview

- Base URL: `/api/v1`
- All responses are in JSON format
- Authentication uses JWT tokens in the Authorization header
- Error responses follow a consistent format
- Pagination is supported for list endpoints

## Authentication Endpoints

### Register with Email

```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification.",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login with Email

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "email": "user@example.com",
    "name": "John Doe",
    "isAdmin": false
  }
}
```

### Login/Register with Azure AD

```
GET /auth/azure
```

Redirects to Azure AD login page. After successful authentication, redirects back to the application with the necessary tokens.

### Azure AD Callback

```
GET /auth/azure/callback
```

Handles the callback from Azure AD after successful authentication.

**Response (Redirect):**
Redirects to the application's homepage with a JWT token.

### Logout

```
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get Current User

```
GET /auth/me
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "email": "user@example.com",
    "profile": {
      "name": "John Doe",
      "picture": "https://example.com/images/profile.jpg",
      "backgroundPicture": "https://example.com/images/background.jpg",
      "description": "A brief description",
      "location": "Building A",
      "phoneNumber": "+1234567890"
    },
    "isAdmin": false,
    "favoriteListings": ["60d21b4667d0d8992e610c86", "60d21b4667d0d8992e610c87"]
  }
}
```

## User Endpoints

### Update User Profile

```
PUT /users/profile
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "name": "John Smith",
  "description": "Updated description",
  "location": "Building B",
  "phoneNumber": "+0987654321",
  "email": "contact@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": {
    "name": "John Smith",
    "picture": "https://example.com/images/profile.jpg",
    "backgroundPicture": "https://example.com/images/background.jpg",
    "description": "Updated description",
    "location": "Building B",
    "phoneNumber": "+0987654321",
    "email": "contact@example.com"
  }
}
```

### Upload Profile Picture

```
POST /users/profile/picture
```

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary data]
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile picture updated successfully",
  "picture": "https://example.com/images/new-profile.jpg"
}
```

### Upload Profile Background Picture

```
POST /users/profile/background
```

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary data]
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Background picture updated successfully",
  "backgroundPicture": "https://example.com/images/new-background.jpg"
}
```

### Get User Favorites

```
GET /users/favorites
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "favorites": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "title": "Ergonomic Chair",
      "price": {
        "amount": 50,
        "currency": "USD",
        "negotiable": true
      },
      "category": "Furniture",
      "location": "Building A",
      "status": "active",
      "media": [
        {
          "url": "https://example.com/images/chair.jpg",
          "type": "image"
        }
      ],
      "author": {
        "id": "60d21b4667d0d8992e610c88",
        "name": "Jane Doe",
        "picture": "https://example.com/images/jane.jpg"
      },
      "createdAt": "2023-05-01T12:00:00Z"
    }
  ]
}
```

## Listing Endpoints

### Create Listing

```
POST /listings
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "title": "Ergonomic Chair",
  "description": "Comfortable office chair in good condition",
  "price": {
    "amount": 50,
    "currency": "USD",
    "negotiable": true
  },
  "category": "Furniture",
  "location": "Building A",
  "tags": ["office", "chair", "ergonomic"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Listing created successfully",
  "listing": {
    "id": "60d21b4667d0d8992e610c86",
    "title": "Ergonomic Chair",
    "description": "Comfortable office chair in good condition",
    "price": {
      "amount": 50,
      "currency": "USD",
      "negotiable": true
    },
    "category": "Furniture",
    "location": "Building A",
    "tags": ["office", "chair", "ergonomic"],
    "status": "active",
    "media": [],
    "links": [],
    "author": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "picture": "https://example.com/images/profile.jpg"
    },
    "createdAt": "2023-05-10T10:30:00Z",
    "updatedAt": "2023-05-10T10:30:00Z"
  }
}
```

### Get All Listings

```
GET /listings
```

**Query Parameters:**
- `category`: Filter by category
- `location`: Filter by location
- `status`: Filter by status (default: "active")
- `tags`: Filter by tags (comma-separated)
- `search`: Search in title and description
- `sort`: Sort field (default: "createdAt")
- `order`: Sort order (default: "desc")
- `limit`: Number of results per page (default: 10)
- `page`: Page number (default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "listings": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "title": "Ergonomic Chair",
      "description": "Comfortable office chair in good condition",
      "price": {
        "amount": 50,
        "currency": "USD",
        "negotiable": true
      },
      "category": "Furniture",
      "location": "Building A",
      "tags": ["office", "chair", "ergonomic"],
      "status": "active",
      "media": [
        {
          "url": "https://example.com/images/chair.jpg",
          "type": "image"
        }
      ],
      "author": {
        "id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "picture": "https://example.com/images/profile.jpg"
      },
      "createdAt": "2023-05-10T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 10,
    "page": 1,
    "pages": 5
  }
}
```

### Get Recent Listings

```
GET /listings/recent
```

Returns the most recent listings for the homepage (R3.3).

**Query Parameters:**
- `limit`: Number of results (default: 6)
- `location`: Filter by location

**Response (200 OK):**
```json
{
  "success": true,
  "listings": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "title": "Ergonomic Chair",
      "description": "Comfortable office chair in good condition",
      "price": {
        "amount": 50,
        "currency": "USD",
        "negotiable": true
      },
      "category": "Furniture",
      "location": "Building A",
      "status": "active",
      "media": [
        {
          "url": "https://example.com/images/chair.jpg",
          "type": "image"
        }
      ],
      "author": {
        "id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "picture": "https://example.com/images/profile.jpg"
      },
      "createdAt": "2023-05-10T10:30:00Z"
    }
  ]
}
```

### Get Listing by ID

```
GET /listings/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "listing": {
    "id": "60d21b4667d0d8992e610c86",
    "title": "Ergonomic Chair",
    "description": "Comfortable office chair in good condition",
    "price": {
      "amount": 50,
      "currency": "USD",
      "negotiable": true
    },
    "category": "Furniture",
    "location": "Building A",
    "tags": ["office", "chair", "ergonomic"],
    "status": "active",
    "media": [
      {
        "url": "https://example.com/images/chair.jpg",
        "type": "image"
      }
    ],
    "links": [
      {
        "url": "https://example.com/chair-manual.pdf",
        "title": "User Manual"
      }
    ],
    "views": 42,
    "author": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "picture": "https://example.com/images/profile.jpg"
    },
    "createdAt": "2023-05-10T10:30:00Z",
    "updatedAt": "2023-05-10T15:45:00Z"
  }
}
```

### Update Listing

```
PUT /listings/:id
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "title": "Updated Chair Title",
  "description": "Updated description",
  "price": {
    "amount": 45,
    "negotiable": false
  },
  "category": "Furniture",
  "location": "Building B",
  "tags": ["office", "chair", "comfortable"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Listing updated successfully",
  "listing": {
    "id": "60d21b4667d0d8992e610c86",
    "title": "Updated Chair Title",
    "description": "Updated description",
    "price": {
      "amount": 45,
      "currency": "USD",
      "negotiable": false
    },
    "category": "Furniture",
    "location": "Building B",
    "tags": ["office", "chair", "comfortable"],
    "status": "active",
    "updatedAt": "2023-05-11T09:20:00Z"
  }
}
```

### Upload Listing Media

```
POST /listings/:id/media
```

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary data]
type: "image" | "document"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Media uploaded successfully",
  "media": {
    "url": "https://example.com/images/chair-side.jpg",
    "type": "image",
    "name": "chair-side.jpg",
    "size": 153284,
    "mimeType": "image/jpeg"
  }
}
```

### Add Link to Listing

```
POST /listings/:id/links
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "url": "https://example.com/chair-review.html",
  "title": "Product Review"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Link added successfully",
  "link": {
    "url": "https://example.com/chair-review.html",
    "title": "Product Review"
  }
}
```

### Change Listing Status

```
PUT /listings/:id/status
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "status": "reserved" | "active" | "completed" | "removed"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status updated successfully",
  "status": "reserved",
  "reservedBy": {
    "id": "60d21b4667d0d8992e610c87",
    "name": "Jane Smith"
  },
  "reservedAt": "2023-05-12T14:30:00Z"
}
```

### Reserve Listing

```
POST /listings/:id/reserve
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item reserved successfully",
  "listing": {
    "id": "60d21b4667d0d8992e610c86",
    "title": "Updated Chair Title",
    "status": "reserved",
    "reservedBy": {
      "id": "60d21b4667d0d8992e610c87",
      "name": "Jane Smith"
    },
    "reservedAt": "2023-05-12T14:30:00Z"
  }
}
```

### Cancel Reservation

```
POST /listings/:id/cancel-reservation
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reservation cancelled successfully",
  "listing": {
    "id": "60d21b4667d0d8992e610c86",
    "title": "Updated Chair Title",
    "status": "active"
  }
}
```

### Add to Favorites

```
POST /listings/:id/favorite
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Added to favorites"
}
```

### Remove from Favorites

```
DELETE /listings/:id/favorite
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Removed from favorites"
}
```

### Get User Listings

```
GET /users/:id/listings
```

**Query Parameters:**
- `status`: Filter by status (default: "active")
- `limit`: Number of results per page (default: 10)
- `page`: Page number (default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "listings": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "title": "Ergonomic Chair",
      "price": {
        "amount": 50,
        "currency": "USD",
        "negotiable": true
      },
      "category": "Furniture",
      "location": "Building A",
      "status": "active",
      "media": [
        {
          "url": "https://example.com/images/chair.jpg",
          "type": "image"
        }
      ],
      "createdAt": "2023-05-10T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 10,
    "page": 1,
    "pages": 1
  }
}
```

## Comment Endpoints

### Add Comment to Listing

```
POST /listings/:id/comments
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "text": "Is this still available? Can I see it tomorrow?"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "comment": {
    "id": "60d21b4667d0d8992e610c89",
    "text": "Is this still available? Can I see it tomorrow?",
    "author": {
      "id": "60d21b4667d0d8992e610c87",
      "name": "Jane Smith",
      "picture": "https://example.com/images/jane.jpg"
    },
    "createdAt": "2023-05-12T16:45:00Z"
  }
}
```

### Get Comments for Listing

```
GET /listings/:id/comments
```

**Query Parameters:**
- `limit`: Number of results per page (default: 10)
- `page`: Page number (default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "comments": [
    {
      "id": "60d21b4667d0d8992e610c89",
      "text": "Is this still available? Can I see it tomorrow?",
      "author": {
        "id": "60d21b4667d0d8992e610c87",
        "name": "Jane Smith",
        "picture": "https://example.com/images/jane.jpg"
      },
      "createdAt": "2023-05-12T16:45:00Z"
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 10,
    "page": 1,
    "pages": 1
  }
}
```

### Update Comment

```
PUT /comments/:id
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "text": "Updated comment text"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "comment": {
    "id": "60d21b4667d0d8992e610c89",
    "text": "Updated comment text",
    "updatedAt": "2023-05-12T17:10:00Z"
  }
}
```

### Delete Comment

```
DELETE /comments/:id
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

## Configuration Endpoints

### Get Categories

```
GET /config/categories
```

Returns the list of categories from environment configuration.

**Response (200 OK):**
```json
{
  "success": true,
  "categories": ["Electronics", "Furniture", "Clothing", "Books", "Sports", "Other"]
}
```

### Get Locations

```
GET /config/locations
```

Returns the list of locations from environment configuration.

**Response (200 OK):**
```json
{
  "success": true,
  "locations": ["Building A", "Building B", "Office 1", "Office 2", "Remote"]
}
```

### Get Branding

```
GET /config/branding
```

Returns the branding information from environment configuration.

**Response (200 OK):**
```json
{
  "success": true,
  "branding": {
    "name": "Company Second-Hand Store",
    "logo": "https://example.com/images/company-logo.png"
  }
}
```

## Admin Endpoints

### Get All Users

```
GET /admin/users
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `search`: Search by name or email
- `limit`: Number of results per page (default: 10)
- `page`: Page number (default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "users": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "email": "user@example.com",
      "profile": {
        "name": "John Doe",
        "picture": "https://example.com/images/profile.jpg"
      },
      "createdAt": "2023-05-01T12:00:00Z",
      "lastLoginAt": "2023-05-12T09:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "page": 1,
    "pages": 3
  }
}
```

### Get Admin Dashboard Stats

```
GET /admin/stats
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "users": {
      "total": 52,
      "new": 5
    },
    "listings": {
      "total": 187,
      "active": 130,
      "reserved": 25,
      "completed": 32
    },
    "categories": [
      {
        "name": "Electronics",
        "count": 45
      },
      {
        "name": "Furniture",
        "count": 38
      }
    ],
    "locations": [
      {
        "name": "Building A",
        "count": 65
      },
      {
        "name": "Building B",
        "count": 42
      }
    ]
  }
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

Common error codes:

- `UNAUTHORIZED`: Authentication is required
- `FORBIDDEN`: User doesn't have permission
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `INTERNAL_ERROR`: Server error

## Authentication and Authorization

1. **Public Endpoints**: 
   - Auth-related endpoints (except logout and me)
   - GET listings, comments, categories, locations, branding

2. **Authenticated Endpoints**: 
   - All other endpoints require a valid JWT token

3. **Authorization Rules**:
   - Users can only edit/delete their own content
   - Admin users can access admin endpoints and edit/delete any content
   - Listing status changes have specific rules (e.g., only the author can mark as completed) 