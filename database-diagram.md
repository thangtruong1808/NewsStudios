```mermaid
erDiagram
    Users ||--o{ Articles : "writes"
    Users {
        int id PK
        string firstname
        string lastname
        string email
        string password
        enum role
        text description
        timestamp created_at
        timestamp updated_at
    }

    Categories ||--o{ SubCategories : "has"
    Categories ||--o{ Articles : "contains"
    Categories ||--o{ Advertisements : "sponsors"
    Categories {
        int id PK
        string name
        text description
        timestamp created_at
        timestamp updated_at
    }

    SubCategories ||--o{ Articles : "contains"
    SubCategories {
        int id PK
        int category_id FK
        string name
        text description
        timestamp created_at
        timestamp updated_at
    }

    Articles ||--o{ Images : "has"
    Articles ||--o{ Videos : "has"
    Articles ||--o{ Article_Tags : "has"
    Articles ||--o{ Advertisements : "sponsors"
    Articles {
        int id PK
        int user_id FK
        int category_id FK
        int sub_category_id FK
        int author_id FK
        string title
        text content
        text image
        text video
        timestamp published_at
        timestamp updated_at
        boolean is_featured
        int headline_priority
        text headline_image_url
        text headline_video_url
        boolean is_trending
    }

    Authors ||--o{ Articles : "writes"
    Authors {
        int id PK
        string name
        text bio
        timestamp created_at
        timestamp updated_at
    }

    Images {
        int id PK
        int article_id FK
        text image_url
        timestamp created_at
        timestamp updated_at
    }

    Videos {
        int id PK
        int article_id FK
        text video_url
        timestamp created_at
        timestamp updated_at
    }

    Tags ||--o{ Article_Tags : "has"
    Tags {
        int id PK
        string name
        timestamp created_at
        timestamp updated_at
    }

    Article_Tags {
        int article_id FK
        int tag_id FK
    }

    Sponsors ||--o{ Advertisements : "sponsors"
    Sponsors {
        int id PK
        string name
        string contact_email
        string contact_phone
        string website_url
        string image_url
        string video_url
        timestamp created_at
        timestamp updated_at
    }

    Advertisements {
        int id PK
        int sponsor_id FK
        int article_id FK
        int category_id FK
        timestamp start_date
        timestamp end_date
        string ad_type
        text ad_content
        string image_url
        string video_url
        timestamp created_at
        timestamp updated_at
    }
```

## Database Schema Overview

This diagram shows the relationships between all tables in the database:

1. **Users**: Core user management table
2. **Categories**: Main content categories
3. **SubCategories**: Sub-categories related to main categories
4. **Articles**: Main content table with relationships to categories and authors
5. **Authors**: Content creators information
6. **Images**: Article-related images
7. **Videos**: Article-related videos
8. **Tags**: Content tagging system
9. **Article_Tags**: Many-to-many relationship between articles and tags
10. **Sponsors**: Advertisement sponsors information
11. **Advertisements**: Advertisement management

### Key Relationships:

- Articles belong to Users (who write them)
- Articles belong to Categories and SubCategories
- Articles can have multiple Images and Videos
- Articles can have multiple Tags through Article_Tags
- Articles can be associated with Advertisements
- Categories can have multiple SubCategories
- Sponsors can have multiple Advertisements
- Articles can be associated with Authors (optional)

### Foreign Key Behaviors:

- User deletion cascades to their Articles
- Category/SubCategory deletion sets NULL in Articles
- Author deletion sets NULL in Articles
- Article deletion cascades to Images, Videos, and Article_Tags
- Sponsor deletion cascades to Advertisements
- Article/Category deletion cascades to Advertisements
