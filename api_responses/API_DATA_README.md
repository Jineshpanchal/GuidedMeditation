# Guided Meditation API Data Reference

This directory contains data fetched from the Brahma Kumaris Guided Meditation API endpoints. The data has been fetched and organized to provide a comprehensive reference for future use.

## Available Files

- **all_data.json**: Combined data from all API endpoints
- **relationships.json**: Identified relationships between different data types
- Individual endpoint files:
  - **gm-ages.json**: Age groups for meditation content
  - **gm-categories.json**: Categories of meditation content
  - **gm-languages.json**: Available languages
  - **gm-lengths.json**: Duration categories for meditations
  - **gm-meditations.json**: Detailed meditation content
  - **gm-rajyoga-teachers.json**: Information about teachers

## Data Structure Overview

### Ages (gm-ages)
- Contains age groups for meditation targeting
- Key fields:
  - `name`: Name of the age group
  - `spectrum`: Target age range
  - `slug`: URL-friendly identifier
  - `ShortBio` & `LongBio`: Descriptions
  - `featuredimage`: Image representation
  - `gm_categories`: Related categories

### Categories (gm-categories)
- Categorization system for meditation content
- Key fields:
  - `Category`: Name of the category
  - `ShortDescription` & `LongDescription`: Details about the category
  - `Slug`: URL-friendly identifier
  - `IsActive`: Status flag
  - `featuredimage`: Category image

### Languages (gm-languages)
- Available languages for meditation content
- Key fields:
  - `name`: Language name
  - `code`: Language code
  - `IsActive`: Availability status

### Lengths (gm-lengths)
- Duration categories for meditations
- Key fields:
  - `name`: Duration category name
  - `mintues`: Minutes range
  - `IsActive`: Status flag

### Meditations (gm-meditations)
- Core meditation content
- Key fields:
  - `Title`: Meditation title
  - `Trending`: Popularity flag
  - `DisplayTitle`: Title shown to users
  - `Slug`: URL-friendly identifier
  - `CommentaryLyrics`: Meditation script
  - `BenefitsShort`: Brief overview of benefits
  - Related fields: May include categories, languages, ages, teachers, etc.

### Rajyoga Teachers (gm-rajyoga-teachers)
- Information about meditation teachers
- Key fields:
  - `name`: Teacher's name
  - `bio`: Teacher biography
  - `IsActive`: Status flag
  - `featuredimage`: Teacher's photo

## Relationships

The API data uses Strapi's relationship model where entities can be related through reference fields. Common patterns include:

1. **One-to-Many**: For example, a Category may have many Meditations
2. **Many-to-Many**: For example, Meditations can be available in multiple Languages
3. **One-to-One**: For example, a Meditation may have one primary Teacher

The `relationships.json` file documents these connections based on the data structure analysis.

## Usage Notes

- Use the `populate=*` parameter when querying the Strapi API to fetch related data
- For deeply nested relationships, use `populate=deep` as seen in the meditations endpoint
- The main API base URL is `https://webapp.brahmakumaris.com/api`
- Authentication is required via an API token

## Fetching Updated Data

To update this data reference, run the included script:

```
node fetch_api_data.js
```

This will refresh all files with the latest data from the API endpoints. 