# Brahma Kumaris Guided Meditation API - Data Structure and Relationships

## Overview

This document provides a detailed map of the Strapi API entities and their relationships for the Brahma Kumaris Guided Meditation platform.

## Entities

| Entity | Description |
|--------|-------------|
| gm-ages | Age groups for targeted meditation content |
| gm-categories | Categories for organizing meditation content |
| gm-languages | Available languages for meditations |
| gm-lengths | Duration categories for meditations |
| gm-meditations | Core meditation content |
| gm-rajyoga-teachers | Information about rajyoga teachers |

## Entity Fields

### gm-ages

| Field | Type | Description |
|-------|------|-------------|
| `name` | Attribute |  |
| `spectrum` | Attribute | Age range |
| `slug` | Attribute |  |
| `ShortBio` | Attribute |  |
| `LongBio` | Attribute |  |
| `createdAt` | Attribute | Timestamp |
| `updatedAt` | Attribute | Timestamp |
| `publishedAt` | Attribute | Timestamp |
| `featuredimage` | Attribute |  |
| `gm_categories` | Attribute | Relationship to gm categories |

### gm-categories

| Field | Type | Description |
|-------|------|-------------|
| `Category` | Attribute | Category name |
| `ShortIntro` | Attribute | Brief description |
| `BigIntro` | Attribute | Comprehensive description |
| `Trending` | Attribute | Featured/trending flag |
| `createdAt` | Attribute | Timestamp |
| `updatedAt` | Attribute | Timestamp |
| `publishedAt` | Attribute | Timestamp |
| `CategoryDisplay` | Attribute |  |
| `slug` | Attribute |  |
| `FeaturedImage` | Attribute | Image associated with the content |
| `gm_meditations` | Attribute | Relationship to gm meditations |
| `gm_age` | Attribute | Relationship to gm age |

### gm-languages

| Field | Type | Description |
|-------|------|-------------|
| `Language` | Attribute | Language name |
| `Slug` | Attribute | URL-friendly identifier |
| `ShortIntro` | Attribute | Brief description |
| `createdAt` | Attribute | Timestamp |
| `updatedAt` | Attribute | Timestamp |
| `publishedAt` | Attribute | Timestamp |
| `FeaturedImage` | Attribute | Image associated with the content |
| `gm_meditations` | Attribute | Relationship to gm meditations |

### gm-lengths

| Field | Type | Description |
|-------|------|-------------|
| `Length` | Attribute | Duration category |
| `slug` | Attribute |  |
| `ShortIntro` | Attribute | Brief description |
| `BigIntro` | Attribute | Comprehensive description |
| `createdAt` | Attribute | Timestamp |
| `updatedAt` | Attribute | Timestamp |
| `publishedAt` | Attribute | Timestamp |
| `FeaturedImage` | Attribute | Image associated with the content |
| `gm_meditations` | Attribute | Relationship to gm meditations |

### gm-meditations

| Field | Type | Description |
|-------|------|-------------|
| `Title` | Attribute | Title of the content |
| `Trending` | Attribute | Featured/trending flag |
| `DisplayTitle` | Attribute | User-facing title |
| `Slug` | Attribute | URL-friendly identifier |
| `CommentaryLyrics` | Attribute |  |
| `BenefitsShort` | Attribute |  |
| `BenefitsBig` | Attribute |  |
| `Duration` | Attribute | Length in minutes |
| `createdAt` | Attribute | Timestamp |
| `updatedAt` | Attribute | Timestamp |
| `publishedAt` | Attribute | Timestamp |
| `FeaturedImage` | Attribute | Image associated with the content |
| `Media` | Attribute |  |
| `gm_categories` | Attribute | Relationship to gm categories |
| `gm_language` | Attribute | Relationship to gm language |
| `gm_length` | Attribute | Relationship to gm length |
| `gm_rajyoga_teachers` | Attribute | Relationship to gm rajyoga_teachers |

### gm-rajyoga-teachers

| Field | Type | Description |
|-------|------|-------------|
| `Name` | Attribute | Name of the item |
| `Slug` | Attribute | URL-friendly identifier |
| `ShortIntro` | Attribute | Brief description |
| `BigIntro` | Attribute | Comprehensive description |
| `KnowMore` | Attribute |  |
| `Designation` | Attribute |  |
| `createdAt` | Attribute | Timestamp |
| `updatedAt` | Attribute | Timestamp |
| `publishedAt` | Attribute | Timestamp |
| `FeaturedImage` | Attribute | Image associated with the content |
| `gm_meditations` | Attribute | Relationship to gm meditations |

## Relationship Map

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

## API Querying Guide

### Basic Queries

- Get all meditations: `GET /api/gm-meditations`
- Get meditation by ID: `GET /api/gm-meditations/{id}`

### Including Related Data

Strapi uses the `populate` parameter to include related data:

- `?populate=*` - Include all first-level relationships
- `?populate=deep` - Include deeply nested relationships
- `?populate[0]=relation1&populate[1]=relation2` - Include specific relationships

Examples:

- Get meditations with categories: `GET /api/gm-meditations?populate=gm_categories`
- Get comprehensive meditation data: `GET /api/gm-meditations?populate=deep`
- Get categories with related meditations: `GET /api/gm-categories?populate=gm_meditations`

### Filtering

Use filters to narrow results:

- Filter by attribute: `GET /api/gm-meditations?filters[Trending]=true`
- Filter by relationship: `GET /api/gm-meditations?filters[gm_categories][Category]=Relaxation`
