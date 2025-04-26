# Brahma Kumaris Guided Meditation API Data Repository

This directory contains a comprehensive collection of data from the Brahma Kumaris Guided Meditation API, organized for easy reference and analysis. The data has been fetched directly from the Strapi-based API and includes all major entity types with their relationships mapped.

## Directory Contents

- **Individual API Data Files**:
  - `gm-ages.json` - Age groups for meditation content
  - `gm-categories.json` - Categories for organizing meditations
  - `gm-languages.json` - Available languages for content
  - `gm-lengths.json` - Duration categories for meditations
  - `gm-meditations.json` - Core meditation content with details
  - `gm-rajyoga-teachers.json` - Information about rajyoga teachers

- **Combined and Analysis Files**:
  - `all_data.json` - Unified collection of all API responses
  - `data_structure_and_relationships.md` - Comprehensive documentation of entities and their relationships
  - `relationships.json` - Raw relationship data between entities
  - `relationships_diagram.md` - Visual representation of entity relationships
  - `enhanced_relationships.md` - Additional relationship analysis
  - `API_DATA_README.md` - Documentation of data structure and fields

## API Overview

The API provides access to guided meditation content organized into several interconnected entities:

1. **Meditations** (`gm-meditations`) - The core content including titles, descriptions, benefits, and media
2. **Categories** (`gm-categories`) - Thematic groupings for meditation content
3. **Languages** (`gm-languages`) - Available languages for meditations
4. **Age Groups** (`gm-ages`) - Target age demographics 
5. **Lengths** (`gm-lengths`) - Duration categorization
6. **Teachers** (`gm-rajyoga-teachers`) - Information about rajyoga instructors

## Understanding Relationships

The data follows Strapi's relationship model where entities connect through reference fields. Key relationships include:

- Meditations are categorized into specific Categories
- Meditations are available in various Languages
- Meditations are presented by Rajyoga Teachers
- Meditations have designated Length categories
- Age groups have associated Categories

Refer to `data_structure_and_relationships.md` for a detailed mapping of these connections.

## API Usage Guide

### Base URL
```
https://webapp.brahmakumaris.com/api
```

### Authentication
API requests require an authentication token passed in the header:
```
Authorization: Bearer <API_TOKEN>
```

### Common Query Patterns

1. **Basic Collection Retrieval**
   ```
   GET /api/gm-meditations
   ```

2. **Including Related Data**
   ```
   GET /api/gm-meditations?populate=*
   GET /api/gm-meditations?populate=deep
   GET /api/gm-meditations?populate=gm_categories,gm_language
   ```

3. **Filtering Data**
   ```
   GET /api/gm-meditations?filters[Trending]=true
   GET /api/gm-meditations?filters[gm_categories][id]=5
   ```

## Data Maintenance

This repository includes scripts for fetching the latest API data:

- `fetch_api_data.js` - Updates all individual API response files
- `analyze_strapi_relationships.js` - Regenerates the documentation of relationships

Run these scripts to refresh the data when needed:
```
node fetch_api_data.js
node analyze_strapi_relationships.js
```

## Using This Data

The collected data can be used for:

1. Reference for front-end development
2. Understanding data models for content planning
3. Creating comprehensive documentation
4. Debugging API integration issues
5. Analyzing content organization and relationships 