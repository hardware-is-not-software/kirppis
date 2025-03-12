# UI Wireframes

This document outlines the key screens and user interface elements for the second-hand store application.

## Overview

The UI design follows these principles:
- Clean, modern interface with responsive design
- Intuitive navigation and clear call-to-actions
- Emphasis on listing images and important details
- Consistent branding throughout the application
- Accessibility considerations

## Navigation Structure

```
├── Public Pages
│   ├── Home/Landing Page
│   ├── Listings Browse/Search
│   ├── Listing Detail
│   ├── Login
│   └── Register
└── Authenticated Pages
    ├── User Profile
    ├── Create/Edit Listing
    ├── My Listings
    ├── My Favorites
    ├── My Reservations
    └── Admin Dashboard (admin only)
```

## 1. Home/Landing Page

The homepage serves as the entry point to the application, showcasing recent listings and providing quick access to key features.

```
+------------------------------------------------------+
|  LOGO                                  LOGIN SIGNUP  |
+------------------------------------------------------+
|                                                      |
|  WELCOME TO COMPANY SECOND-HAND STORE                |
|                                                      |
+------------------------------------------------------+
|  LOCATION: [Dropdown] ▼                              |
+------------------------------------------------------+
|  SEARCH: [                    ]  CATEGORIES: [    ]  |
+------------------------------------------------------+
|                                                      |
|  RECENT LISTINGS                                     |
|  +--------+  +--------+  +--------+                  |
|  |        |  |        |  |        |                  |
|  | Item 1 |  | Item 2 |  | Item 3 |                  |
|  |        |  |        |  |        |                  |
|  | $XX    |  | $XX    |  | $XX    |                  |
|  +--------+  +--------+  +--------+                  |
|                                                      |
|  +--------+  +--------+  +--------+                  |
|  |        |  |        |  |        |                  |
|  | Item 4 |  | Item 5 |  | Item 6 |                  |
|  |        |  |        |  |        |                  |
|  | $XX    |  | $XX    |  | $XX    |                  |
|  +--------+  +--------+  +--------+                  |
|                                                      |
|  [VIEW ALL LISTINGS]                                 |
|                                                      |
+------------------------------------------------------+
|  Footer: About | Terms | Contact                     |
+------------------------------------------------------+
```

### Key Components:
- **Header**: Logo, login/signup buttons (or user profile if logged in)
- **Location Selector**: Prominently displayed to emphasize location importance (R3.2)
- **Search Bar**: Quick search functionality
- **Category Filter**: Quick access to category filtering
- **Recent Listings Grid**: Displays 6 most recent listings (R3.3)
- **View All Button**: Links to the full listings page

## 2. Listings Browse/Search Page

This page allows users to browse and search for listings with various filtering options.

```
+------------------------------------------------------+
|  LOGO                         USER PROFILE / LOGIN   |
+------------------------------------------------------+
|  SEARCH: [                    ]  [SEARCH]            |
+------------------------------------------------------+
|                                                      |
|  FILTERS:                          SORT BY: [      ] |
|  +----------------+                                  |
|  | Categories     |   +----------------------------+ |
|  | [ ] Electronics|   |                            | |
|  | [ ] Furniture  |   |  +--------+  +--------+    | |
|  | [ ] Clothing   |   |  |        |  |        |    | |
|  | [ ] Books      |   |  | Item 1 |  | Item 2 |    | |
|  | [ ] Sports     |   |  |        |  |        |    | |
|  | [ ] Other      |   |  | $XX    |  | $XX    |    | |
|  +----------------+   |  +--------+  +--------+    | |
|                       |                            | |
|  +----------------+   |  +--------+  +--------+    | |
|  | Location       |   |  |        |  |        |    | |
|  | [ ] Building A |   |  | Item 3 |  | Item 4 |    | |
|  | [ ] Building B |   |  |        |  |        |    | |
|  | [ ] Office 1   |   |  | $XX    |  | $XX    |    | |
|  | [ ] Office 2   |   |  +--------+  +--------+    | |
|  | [ ] Remote     |   |                            | |
|  +----------------+   |  +--------+  +--------+    | |
|                       |  |        |  |        |    | |
|  +----------------+   |  | Item 5 |  | Item 6 |    | |
|  | Status         |   |  |        |  |        |    | |
|  | [x] Active     |   |  | $XX    |  | $XX    |    | |
|  | [ ] Reserved   |   |  +--------+  +--------+    | |
|  +----------------+   |                            | |
|                       +----------------------------+ |
|  [CLEAR FILTERS]                                     |
|                                                      |
|  Pagination: < 1 2 3 ... >                           |
+------------------------------------------------------+
```

### Key Components:
- **Search Bar**: For keyword search
- **Filter Panel**: Categories, locations, status filters
- **Sort Options**: Sort by price, date, etc.
- **Listing Grid**: Displays listings with images and key details
- **Pagination**: For navigating through multiple pages of results

## 3. Listing Detail Page

This page displays detailed information about a specific listing.

```
+------------------------------------------------------+
|  LOGO                         USER PROFILE / LOGIN   |
+------------------------------------------------------+
|  < Back to Listings                                  |
+------------------------------------------------------+
|                                                      |
|  ITEM TITLE                                          |
|  Category | Location                   Posted: Date  |
|                                                      |
|  +------------------------+  +-----------------------+
|  |                        |  | Price: $XX            |
|  |                        |  | [Negotiable]          |
|  |       Main Image       |  |                       |
|  |                        |  | Status: Active        |
|  |                        |  |                       |
|  +------------------------+  | [RESERVE ITEM]        |
|                             | [ADD TO FAVORITES]     |
|  +-----+ +-----+ +-----+    |                       |
|  |Thumb| |Thumb| |Thumb|    | Seller:               |
|  +-----+ +-----+ +-----+    | Name (with picture)    |
|                             | Contact                |
|  Description:               +-----------------------+
|  Detailed description of the item...                 |
|  ...                                                 |
|                                                      |
|  Tags: tag1, tag2, tag3                              |
|                                                      |
|  Documents:                                          |
|  - Document1.pdf                                     |
|  - Document2.pdf                                     |
|                                                      |
|  Links:                                              |
|  - [Link Title 1]                                    |
|  - [Link Title 2]                                    |
|                                                      |
|  +----------------------------------------------+    |
|  | Comments:                                    |    |
|  |                                              |    |
|  | User1: Is this still available?              |    |
|  | Date/Time                                    |    |
|  |                                              |    |
|  | User2: Does it come with accessories?        |    |
|  | Date/Time                                    |    |
|  |                                              |    |
|  | [Add a comment...]                           |    |
|  | [SUBMIT]                                     |    |
|  +----------------------------------------------+    |
|                                                      |
+------------------------------------------------------+
```

### Key Components:
- **Image Gallery**: Main image with thumbnails
- **Item Details**: Title, price, category, location, status
- **Action Buttons**: Reserve, favorite (for authenticated users)
- **Seller Information**: Name, picture, contact details
- **Item Description**: Detailed text description
- **Tags**: Related tags for the item (R3.1)
- **Attachments**: Documents and links (R3.8, R3.9)
- **Comments Section**: View existing comments and add new ones (R3.6)

## 4. User Profile Page

This page displays and allows editing of the user's profile information.

```
+------------------------------------------------------+
|  LOGO                         USER PROFILE / LOGIN   |
+------------------------------------------------------+
|                                                      |
|  +------------------------+                          |
|  |                        |                          |
|  |   Background Image     |                          |
|  |                        |                          |
|  +------------------------+                          |
|                                                      |
|  +------+  User Name                                 |
|  |Profile|  Location: Building A                     |
|  |Picture|  [EDIT PROFILE]                           |
|  +------+                                            |
|                                                      |
|  About Me:                                           |
|  User description text...                            |
|                                                      |
|  Contact Information:                                |
|  Email: user@example.com                             |
|  Phone: +1234567890                                  |
|                                                      |
|  +----------------------------------------------+    |
|  | NAVIGATION:                                  |    |
|  | [MY LISTINGS] [MY FAVORITES] [MY RESERVATIONS]    |
|  +----------------------------------------------+    |
|                                                      |
|  MY LISTINGS:                                        |
|  +--------+  +--------+  +--------+                  |
|  |        |  |        |  |        |                  |
|  | Item 1 |  | Item 2 |  | Item 3 |                  |
|  |        |  |        |  |        |                  |
|  | $XX    |  | $XX    |  | $XX    |                  |
|  +--------+  +--------+  +--------+                  |
|                                                      |
|  [VIEW ALL MY LISTINGS]                              |
|                                                      |
+------------------------------------------------------+
```

### Key Components:
- **Profile Header**: Background image, profile picture, name (R0.8, R0.9, R0.10)
- **User Information**: Location, description, contact details (R0.11, R0.12, R0.13, R0.14)
- **Edit Profile Button**: For updating profile information
- **Navigation Tabs**: Switch between listings, favorites, and reservations
- **Content Area**: Displays the selected tab's content

## 5. Create/Edit Listing Page

This page allows users to create new listings or edit existing ones.

```
+------------------------------------------------------+
|  LOGO                         USER PROFILE / LOGIN   |
+------------------------------------------------------+
|                                                      |
|  CREATE NEW LISTING                                  |
|                                                      |
|  Title: [                                         ]  |
|                                                      |
|  Category: [Dropdown] ▼                              |
|                                                      |
|  Location: [Dropdown] ▼                              |
|                                                      |
|  Price: [$       ]  [ ] Negotiable                   |
|                                                      |
|  Description:                                        |
|  [                                                ]  |
|  [                                                ]  |
|  [                                                ]  |
|                                                      |
|  Tags: [                                          ]  |
|  (Comma separated tags)                              |
|                                                      |
|  Upload Images:                                      |
|  [SELECT FILES]                                      |
|                                                      |
|  +-----+ +-----+ +-----+                             |
|  |Img 1| |Img 2| |Img 3|  [+ Add more]               |
|  +-----+ +-----+ +-----+                             |
|                                                      |
|  Upload Documents:                                   |
|  [SELECT FILES]                                      |
|                                                      |
|  Add Links:                                          |
|  URL: [                    ] Title: [            ]   |
|  [+ ADD LINK]                                        |
|                                                      |
|  Links:                                              |
|  - Link 1 [Remove]                                   |
|  - Link 2 [Remove]                                   |
|                                                      |
|  [CANCEL]                [SAVE DRAFT]  [PUBLISH]     |
|                                                      |
+------------------------------------------------------+
```

### Key Components:
- **Form Fields**: Title, category, location, price, description
- **Tags Input**: For adding searchable tags (R3.1)
- **Media Upload**: For images and documents (R3.7, R3.8)
- **Links Section**: For adding external links (R3.9)
- **Action Buttons**: Cancel, save draft, publish

## 6. Login/Registration Pages

### Login Page

```
+------------------------------------------------------+
|  LOGO                                                |
+------------------------------------------------------+
|                                                      |
|                  LOGIN                               |
|                                                      |
|  +----------------------------------------------+    |
|  |                                              |    |
|  |  [SIGN IN WITH AZURE AD]                     |    |
|  |                                              |    |
|  |  -------------- OR --------------            |    |
|  |                                              |    |
|  |  Email:    [                             ]   |    |
|  |                                              |    |
|  |  Password: [                             ]   |    |
|  |                                              |    |
|  |  [Forgot Password?]                          |    |
|  |                                              |    |
|  |  [LOGIN]                                     |    |
|  |                                              |    |
|  |  Don't have an account? [REGISTER]           |    |
|  |                                              |    |
|  +----------------------------------------------+    |
|                                                      |
+------------------------------------------------------+
```

### Registration Page

```
+------------------------------------------------------+
|  LOGO                                                |
+------------------------------------------------------+
|                                                      |
|                  REGISTER                            |
|                                                      |
|  +----------------------------------------------+    |
|  |                                              |    |
|  |  [SIGN UP WITH AZURE AD]                     |    |
|  |                                              |    |
|  |  -------------- OR --------------            |    |
|  |                                              |    |
|  |  Name:     [                             ]   |    |
|  |                                              |    |
|  |  Email:    [                             ]   |    |
|  |                                              |    |
|  |  Password: [                             ]   |    |
|  |                                              |    |
|  |  Confirm:  [                             ]   |    |
|  |                                              |    |
|  |  [ ] I agree to the Terms of Service         |    |
|  |                                              |    |
|  |  [REGISTER]                                  |    |
|  |                                              |    |
|  |  Already have an account? [LOGIN]            |    |
|  |                                              |    |
|  +----------------------------------------------+    |
|                                                      |
+------------------------------------------------------+
```

### Key Components:
- **Azure AD Button**: Prominent option for company authentication (R0.1, R0.2)
- **Email/Password Fields**: Alternative authentication method (R0.3, R0.5)
- **Form Validation**: Client-side validation for input fields
- **Links**: Navigation between login and registration

## 7. Admin Dashboard

This page provides administrative functions for managing the application.

```
+------------------------------------------------------+
|  LOGO                         ADMIN (USER PROFILE)   |
+------------------------------------------------------+
|                                                      |
|  ADMIN DASHBOARD                                     |
|                                                      |
|  +----------------+  +----------------------------+  |
|  | NAVIGATION     |  | OVERVIEW                   |  |
|  |                |  |                            |  |
|  | [Dashboard]    |  | Total Users: 52            |  |
|  | [Users]        |  | New Users (30d): 5         |  |
|  | [Listings]     |  |                            |  |
|  | [Categories]   |  | Total Listings: 187        |  |
|  | [Locations]    |  | Active: 130                |  |
|  | [Settings]     |  | Reserved: 25               |  |
|  |                |  | Completed: 32              |  |
|  +----------------+  +----------------------------+  |
|                                                      |
|  +----------------------------------------------+    |
|  | RECENT ACTIVITY                              |    |
|  |                                              |    |
|  | - User1 registered (2 hours ago)             |    |
|  | - User2 posted a new listing (3 hours ago)   |    |
|  | - User3 reserved an item (5 hours ago)       |    |
|  | - User4 completed a transaction (1 day ago)  |    |
|  |                                              |    |
|  | [VIEW ALL ACTIVITY]                          |    |
|  +----------------------------------------------+    |
|                                                      |
|  +-------------------+  +----------------------+     |
|  | POPULAR CATEGORIES |  | ACTIVE LOCATIONS    |     |
|  |                    |  |                     |     |
|  | Electronics: 45    |  | Building A: 65      |     |
|  | Furniture: 38      |  | Building B: 42      |     |
|  | Clothing: 32       |  | Office 1: 35        |     |
|  | Books: 28          |  | Office 2: 30        |     |
|  | Sports: 25         |  | Remote: 15          |     |
|  | Other: 19          |  |                     |     |
|  +-------------------+  +----------------------+     |
|                                                      |
+------------------------------------------------------+
```

### Key Components:
- **Navigation Menu**: Access to different admin sections
- **Overview Statistics**: Quick view of key metrics
- **Recent Activity**: Log of recent user actions
- **Category/Location Stats**: Distribution of listings

## Mobile Responsive Considerations

All screens will adapt to mobile devices with these adjustments:
- Single column layout on small screens
- Collapsible navigation menu
- Simplified filters with dropdown expansion
- Touch-friendly buttons and inputs
- Optimized image loading for mobile data

## User Flow Diagrams

### Authentication Flow

```
                    +----------------+
                    |  Landing Page  |
                    +----------------+
                            |
                            v
          +----------------+----------------+
          |                                 |
          v                                 v
+------------------+               +------------------+
| Azure AD Login   |               | Email Login      |
+------------------+               +------------------+
          |                                 |
          v                                 v
+------------------+               +------------------+
| Azure Auth Page  |               | Login Form       |
+------------------+               +------------------+
          |                                 |
          v                                 v
+------------------+               +------------------+
| Callback/Redirect|               | Validation       |
+------------------+               +------------------+
          |                                 |
          v                                 v
                    +----------------+
                    |  Home (Logged  |
                    |      in)       |
                    +----------------+
```

### Listing Creation Flow

```
+----------------+     +----------------+     +----------------+
| User Profile   | --> | Create Listing | --> | Add Details    |
+----------------+     +----------------+     +----------------+
                                                      |
                                                      v
+----------------+     +----------------+     +----------------+
| Publish Listing| <-- | Add Links      | <-- | Upload Media   |
+----------------+     +----------------+     +----------------+
        |
        v
+----------------+
| Listing Detail |
+----------------+
```

### Reservation Flow

```
+----------------+     +----------------+     +----------------+
| Listing Detail | --> | Reserve Button | --> | Confirmation   |
+----------------+     +----------------+     +----------------+
                                                      |
                                                      v
+----------------+     +----------------+     +----------------+
| Complete Deal  | <-- | Communication  | <-- | Reservation    |
+----------------+     | (Comments)     |     | Status         |
                       +----------------+     +----------------+
```

## Accessibility Considerations

- High contrast between text and background
- Keyboard navigation support
- Screen reader compatible elements
- Alternative text for images
- Proper heading hierarchy
- Focus indicators for interactive elements 