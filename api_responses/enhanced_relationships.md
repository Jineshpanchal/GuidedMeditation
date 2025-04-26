# Brahma Kumaris Guided Meditation API Relationships

## Entity Details

### gm-ages

#### Fields

| Field | Type |
|-------|------|
| `name` | Attribute |
| `spectrum` | Attribute |
| `slug` | Attribute |
| `ShortBio` | Attribute |
| `LongBio` | Attribute |
| `createdAt` | Attribute |
| `updatedAt` | Attribute |
| `publishedAt` | Attribute |
| `featuredimage` | Attribute |
| `gm_categories` | Attribute |

### gm-categories

#### Fields

| Field | Type |
|-------|------|
| `Category` | Attribute |
| `ShortIntro` | Attribute |
| `BigIntro` | Attribute |
| `Trending` | Attribute |
| `createdAt` | Attribute |
| `updatedAt` | Attribute |
| `publishedAt` | Attribute |
| `CategoryDisplay` | Attribute |
| `slug` | Attribute |
| `FeaturedImage` | Attribute |
| `gm_meditations` | Attribute |
| `gm_age` | Attribute |

### gm-languages

#### Fields

| Field | Type |
|-------|------|
| `Language` | Attribute |
| `Slug` | Attribute |
| `ShortIntro` | Attribute |
| `createdAt` | Attribute |
| `updatedAt` | Attribute |
| `publishedAt` | Attribute |
| `FeaturedImage` | Attribute |
| `gm_meditations` | Attribute |

### gm-lengths

#### Fields

| Field | Type |
|-------|------|
| `Length` | Attribute |
| `slug` | Attribute |
| `ShortIntro` | Attribute |
| `BigIntro` | Attribute |
| `createdAt` | Attribute |
| `updatedAt` | Attribute |
| `publishedAt` | Attribute |
| `FeaturedImage` | Attribute |
| `gm_meditations` | Attribute |

### gm-meditations

#### Fields

| Field | Type |
|-------|------|
| `Title` | Attribute |
| `Trending` | Attribute |
| `DisplayTitle` | Attribute |
| `Slug` | Attribute |
| `CommentaryLyrics` | Attribute |
| `BenefitsShort` | Attribute |
| `BenefitsBig` | Attribute |
| `Duration` | Attribute |
| `createdAt` | Attribute |
| `updatedAt` | Attribute |
| `publishedAt` | Attribute |
| `FeaturedImage` | Attribute |
| `Media` | Attribute |
| `gm_categories` | Attribute |
| `gm_language` | Attribute |
| `gm_length` | Attribute |
| `gm_rajyoga_teachers` | Attribute |

### gm-rajyoga-teachers

#### Fields

| Field | Type |
|-------|------|
| `Name` | Attribute |
| `Slug` | Attribute |
| `ShortIntro` | Attribute |
| `BigIntro` | Attribute |
| `KnowMore` | Attribute |
| `Designation` | Attribute |
| `createdAt` | Attribute |
| `updatedAt` | Attribute |
| `publishedAt` | Attribute |
| `FeaturedImage` | Attribute |
| `gm_meditations` | Attribute |

## Complete Relationship Map

| From Entity | Relationship | To Entity | Through Field |
|-------------|--------------|-----------|---------------|

## Visual Relationship Diagram

```
[gm-ages]

[gm-categories]

[gm-languages]

[gm-lengths]

[gm-meditations]

[gm-rajyoga-teachers]

```

## Understanding Strapi Relationships

Strapi uses a structured format for representing relationships:

- **One-to-One**: A single record relates to a single record in another collection
- **One-to-Many**: A single record relates to multiple records in another collection
- **Many-to-Many**: Multiple records relate to multiple records in another collection

When querying the API, use the `populate` parameter to include related data:

- `?populate=*` - includes all first-level relationships
- `?populate=deep` - includes deeper nested relationships
- `?populate[0]=field1&populate[1]=field2` - includes specific relationships

Example: `GET /api/gm-meditations?populate=gm_categories,gm_language`
