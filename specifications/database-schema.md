# Database Schema Design

This document outlines the database schema design for the second-hand store application using MongoDB as the database.

## Overview

The application will use MongoDB, a document-oriented NoSQL database. This design focuses on:

- Supporting all required features
- Optimizing for common query patterns
- Enabling flexible schema evolution
- Maintaining referential integrity where needed

## Collections

### Users Collection

Stores user account information and profile data.

```javascript
{
  _id: ObjectId,               // Auto-generated unique identifier
  email: String,               // User email (required, unique)
  password: String,            // Hashed password (if using email auth)
  authProvider: {              // Authentication provider details
    type: String,              // "azure" or "email"
    azureId: String,           // Azure AD user identifier
    refreshToken: String       // For refreshing access tokens
  },
  profile: {
    name: String,              // Full name
    picture: String,           // URL to profile picture (R0.8)
    backgroundPicture: String, // URL to background picture (R0.9)
    description: String,       // User bio/description (R0.10)
    location: String,          // User's primary location (R0.11)
    phoneNumber: String,       // Contact number (R0.12)
    email: String              // Contact email (may differ from login email) (R0.13)
  },
  isAdmin: Boolean,            // Administrator flag
  favoriteListings: [ObjectId],// References to favorited listings (R3.12)
  createdAt: Date,             // Account creation timestamp
  updatedAt: Date,             // Last update timestamp
  lastLoginAt: Date            // Last login timestamp
}
```

**Indexes:**
- `email`: Unique index for email authentication and lookup
- `"authProvider.azureId"`: Index for Azure AD authentication lookup
- `favoriteListings`: Index for efficient favorites lookup

### Listings Collection

Stores information about items/posts in the second-hand store.

```javascript
{
  _id: ObjectId,               // Auto-generated unique identifier
  title: String,               // Listing title (required)
  description: String,         // Detailed description
  price: {                     // Price information
    amount: Number,            // Amount (optional, for free items)
    currency: String,          // Currency code (default from config)
    negotiable: Boolean        // Whether price is negotiable
  },
  category: String,            // Category identifier (from .env) (R2.0)
  location: String,            // Location identifier (from .env) (R2.1, R3.2)
  tags: [String],              // Array of tags for filtering (R3.1)
  status: String,              // "active", "reserved", "completed", "removed" (R3.4, R3.10, R3.11)
  reservedBy: ObjectId,        // User who reserved the item (R3.4)
  reservedAt: Date,            // When the item was reserved
  media: [{                    // Media attachments
    type: String,              // "image", "document"
    url: String,               // URL to the file
    name: String,              // Original filename
    size: Number,              // File size in bytes
    mimeType: String           // MIME type
  }],
  links: [{                    // External links (R3.9)
    url: String,               // Link URL
    title: String              // Link title
  }],
  views: Number,               // View counter
  author: {                    // Listing author
    _id: ObjectId,             // Reference to user ID
    name: String,              // User name (denormalized)
    picture: String            // User picture URL (denormalized)
  },
  createdAt: Date,             // Creation timestamp
  updatedAt: Date              // Last update timestamp
}
```

**Indexes:**
- `category`: For category-based filtering
- `location`: For location-based filtering
- `tags`: For tag-based filtering
- `status`: For status filtering
- `author._id`: For finding user's listings
- `reservedBy`: For finding reserved items
- `createdAt`: For sorting by date (most recent first)

### Comments Collection

Stores comments and questions on listings.

```javascript
{
  _id: ObjectId,               // Auto-generated unique identifier
  listingId: ObjectId,         // Reference to listing
  author: {                    // Comment author
    _id: ObjectId,             // Reference to user ID
    name: String,              // User name (denormalized)
    picture: String            // User picture URL (denormalized)
  },
  text: String,                // Comment content
  createdAt: Date,             // Comment timestamp
  updatedAt: Date              // Last edit timestamp
}
```

**Indexes:**
- `listingId`: For finding comments for a specific listing
- `"author._id"`: For finding comments by a specific user

### Categories Config

Categories will be stored in environment variables and loaded into the application at startup (R2.0, R2.2), rather than storing them in the database. This allows for configuration without database changes.

Example environment variable format:
```
CATEGORIES=Electronics,Furniture,Clothing,Books,Sports,Other
```

### Locations Config

Similar to categories, locations will be stored in environment variables (R2.1, R2.2).

Example environment variable format:
```
LOCATIONS=Building A,Building B,Office 1,Office 2,Remote
```

## Relationships

The database schema uses a mix of embedded and referenced documents:

1. **User → Listings**: One-to-many relationship, referenced via `author._id` in Listings
2. **User → Comments**: One-to-many relationship, referenced via `author._id` in Comments
3. **Listing → Comments**: One-to-many relationship, referenced via `listingId` in Comments
4. **User → Favorites**: Many-to-many relationship, stored as an array of listing IDs in the User document
5. **Listing → Reserved By**: One-to-one relationship, referenced via `reservedBy` in Listings

## Data Validation

The application will implement validation at the application level using:

1. Schema validation on MongoDB collections
2. Input validation in the API controllers
3. Type checking with TypeScript

Example MongoDB schema validation for the Users collection:

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "authProvider", "createdAt"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        authProvider: {
          bsonType: "object",
          required: ["type"],
          properties: {
            type: {
              enum: ["azure", "email"]
            }
          }
        },
        isAdmin: {
          bsonType: "bool"
        }
      }
    }
  }
});
```

## Optimizations

### Denormalization

To optimize common queries, some data is denormalized:

1. Author information (name, picture) in Listings and Comments
   - Reduces need for joins when displaying listings and comments
   - Updated whenever the user profile changes

2. Favorite listings stored as an array in User documents
   - Makes retrieving a user's favorites efficient
   - Requires additional logic when listings are deleted

### Indexing Strategy

1. Single-field indexes for common filters (category, location, status)
2. Compound indexes for combined queries (e.g., active listings in a specific category)
3. Text indexes for search functionality (title, description)

### Pagination

For endpoints that return multiple records (listings, comments):

1. Use cursor-based pagination for listing feeds
2. Implement limit/offset pagination for admin interfaces
3. Default page sizes should be configurable

## Example Queries

### Find Active Listings in a Specific Category and Location

```javascript
db.listings.find({
  status: "active",
  category: "Electronics",
  location: "Building A"
}).sort({ createdAt: -1 }).limit(10);
```

### Find User's Favorite Listings

```javascript
const user = await db.users.findOne({ _id: userId });
const favorites = await db.listings.find({
  _id: { $in: user.favoriteListings },
  status: { $ne: "removed" }
}).toArray();
```

### Get Recent Comments for a Listing

```javascript
db.comments.find({
  listingId: listingId
}).sort({ createdAt: -1 }).limit(10);
```

## Schema Evolution

The schema is designed to allow for future changes without requiring database migrations:

1. New fields can be added without affecting existing documents
2. Field types won't change on existing fields
3. Any required changes to existing fields will require migration scripts

## Data Retention Policies

1. User accounts remain indefinitely unless explicitly deleted
2. Listings are never physically deleted, only marked as "removed" (R3.11)
3. Admin tools should provide data cleanup capabilities if needed

## Security Considerations

1. Passwords stored using strong one-way hashing (bcrypt)
2. Authentication tokens handled securely
3. User permission checks at the data access layer
4. Input sanitization for all user-provided content 