# API Relationships Diagram

## Entity Fields

### gm-ages

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

## Entity Relationships

| From Entity | Relationship | To Entity | Through Field |
|-------------|--------------|-----------|---------------|

## Visual Diagram

```
[gm-ages]

[gm-categories]

[gm-languages]

[gm-lengths]

[gm-meditations]

[gm-rajyoga-teachers]

```
