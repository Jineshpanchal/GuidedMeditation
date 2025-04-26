const fs = require('fs').promises;

async function analyzeRelationships() {
  try {
    // Define our entity types
    const entities = [
      { file: 'gm-ages.json', name: 'gm-ages' },
      { file: 'gm-categories.json', name: 'gm-categories' },
      { file: 'gm-languages.json', name: 'gm-languages' },
      { file: 'gm-lengths.json', name: 'gm-lengths' },
      { file: 'gm-meditations.json', name: 'gm-meditations' },
      { file: 'gm-rajyoga-teachers.json', name: 'gm-rajyoga-teachers' }
    ];
    
    const relationshipMap = {};
    const fieldMap = {};
    
    // Process each entity file
    for (const entity of entities) {
      const data = JSON.parse(await fs.readFile(`./api_responses/${entity.file}`, 'utf8'));
      
      // Extract field information
      fieldMap[entity.name] = new Set();
      relationshipMap[entity.name] = [];
      
      // Get a sample for field analysis
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        const sample = data.data[0];
        if (sample.attributes) {
          // Collect all field names
          for (const [key, value] of Object.entries(sample.attributes)) {
            fieldMap[entity.name].add(key);
            
            // Check if this is a relationship field (Strapi pattern)
            if (value && typeof value === 'object' && value.data) {
              // This is a relationship field
              const relationshipType = Array.isArray(value.data) ? 'many' : 'one';
              let relatedType = null;
              
              // Try to detect the type of the related entity
              if (relationshipType === 'many' && value.data.length > 0) {
                // For one-to-many or many-to-many relationships
                relatedType = getStrapiType(value.data[0]);
              } else if (value.data) {
                // For one-to-one relationships
                relatedType = getStrapiType(value.data);
              }
              
              if (relatedType) {
                relationshipMap[entity.name].push({
                  field: key,
                  type: relationshipType,
                  relatedTo: relatedType
                });
              }
            }
          }
        }
      }
      
      // Convert fields set to array
      fieldMap[entity.name] = Array.from(fieldMap[entity.name]);
    }
    
    // Generate documentation in Markdown format
    let markdown = '# Brahma Kumaris Guided Meditation API - Data Structure and Relationships\n\n';
    
    // Add overview
    markdown += '## Overview\n\n';
    markdown += 'This document provides a detailed map of the Strapi API entities and their relationships for the Brahma Kumaris Guided Meditation platform.\n\n';
    
    // Entity descriptions
    markdown += '## Entities\n\n';
    markdown += '| Entity | Description |\n';
    markdown += '|--------|-------------|\n';
    markdown += '| gm-ages | Age groups for targeted meditation content |\n';
    markdown += '| gm-categories | Categories for organizing meditation content |\n';
    markdown += '| gm-languages | Available languages for meditations |\n';
    markdown += '| gm-lengths | Duration categories for meditations |\n';
    markdown += '| gm-meditations | Core meditation content |\n';
    markdown += '| gm-rajyoga-teachers | Information about rajyoga teachers |\n\n';
    
    // Entity fields
    markdown += '## Entity Fields\n\n';
    
    for (const entityName of Object.keys(fieldMap)) {
      markdown += `### ${entityName}\n\n`;
      markdown += '| Field | Type | Description |\n';
      markdown += '|-------|------|-------------|\n';
      
      // List fields with relationship indicators
      for (const field of fieldMap[entityName]) {
        const isRelationship = relationshipMap[entityName].some(r => r.field === field);
        const relationshipInfo = isRelationship ? 
          relationshipMap[entityName].find(r => r.field === field) : null;
          
        const fieldType = isRelationship ? 
          `Relationship (${relationshipInfo.type === 'many' ? 'Has Many' : 'Has One'} ${relationshipInfo.relatedTo})` : 
          'Attribute';
          
        markdown += `| \`${field}\` | ${fieldType} | ${getFieldDescription(entityName, field)} |\n`;
      }
      
      markdown += '\n';
    }
    
    // Relationship mapping
    markdown += '## Relationship Map\n\n';
    markdown += '| From Entity | Relationship | To Entity | Through Field |\n';
    markdown += '|-------------|--------------|-----------|---------------|\n';
    
    for (const entityName of Object.keys(relationshipMap)) {
      for (const relation of relationshipMap[entityName]) {
        markdown += `| ${entityName} | ${relation.type === 'many' ? 'Has Many' : 'Has One'} | ${relation.relatedTo} | \`${relation.field}\` |\n`;
      }
    }
    
    // Visual diagram
    markdown += '\n## Visual Relationship Diagram\n\n';
    markdown += '```\n';
    
    for (const entityName of Object.keys(relationshipMap)) {
      markdown += `[${entityName}]\n`;
      
      for (const relation of relationshipMap[entityName]) {
        const arrow = relation.type === 'many' ? '---*' : '---->';
        markdown += `  ${arrow} [${relation.relatedTo}] (via ${relation.field})\n`;
      }
      
      markdown += '\n';
    }
    
    markdown += '```\n\n';
    
    // Querying guide
    markdown += '## API Querying Guide\n\n';
    markdown += '### Basic Queries\n\n';
    markdown += '- Get all meditations: `GET /api/gm-meditations`\n';
    markdown += '- Get meditation by ID: `GET /api/gm-meditations/{id}`\n\n';
    
    markdown += '### Including Related Data\n\n';
    markdown += 'Strapi uses the `populate` parameter to include related data:\n\n';
    markdown += '- `?populate=*` - Include all first-level relationships\n';
    markdown += '- `?populate=deep` - Include deeply nested relationships\n';
    markdown += '- `?populate[0]=relation1&populate[1]=relation2` - Include specific relationships\n\n';
    
    markdown += 'Examples:\n\n';
    markdown += '- Get meditations with categories: `GET /api/gm-meditations?populate=gm_categories`\n';
    markdown += '- Get comprehensive meditation data: `GET /api/gm-meditations?populate=deep`\n';
    markdown += '- Get categories with related meditations: `GET /api/gm-categories?populate=gm_meditations`\n\n';
    
    markdown += '### Filtering\n\n';
    markdown += 'Use filters to narrow results:\n\n';
    markdown += '- Filter by attribute: `GET /api/gm-meditations?filters[Trending]=true`\n';
    markdown += '- Filter by relationship: `GET /api/gm-meditations?filters[gm_categories][Category]=Relaxation`\n';
    
    // Save the Markdown file
    await fs.writeFile('./api_responses/data_structure_and_relationships.md', markdown);
    console.log('Analysis complete! See api_responses/data_structure_and_relationships.md');
    
  } catch (error) {
    console.error('Error analyzing relationships:', error);
  }
}

// Helper function to extract Strapi entity type
function getStrapiType(data) {
  if (!data) return null;
  
  if (data.type) {
    return data.type;
  }
  
  return null;
}

// Helper function for field descriptions
function getFieldDescription(entityName, field) {
  // Standard fields
  if (['createdAt', 'updatedAt', 'publishedAt'].includes(field)) {
    return 'Timestamp';
  }
  
  // Common fields with known purposes
  const commonFields = {
    'Title': 'Title of the content',
    'Name': 'Name of the item',
    'Slug': 'URL-friendly identifier',
    'FeaturedImage': 'Image associated with the content',
    'ShortIntro': 'Brief description',
    'BigIntro': 'Comprehensive description',
    'Category': 'Category name',
    'Language': 'Language name',
    'Length': 'Duration category',
    'Trending': 'Featured/trending flag',
    'IsActive': 'Whether the item is active/available',
    'DisplayTitle': 'User-facing title',
    'Duration': 'Length in minutes',
    'spectrum': 'Age range'
  };
  
  if (field in commonFields) {
    return commonFields[field];
  }
  
  // Relationship fields
  if (field.startsWith('gm_')) {
    return `Relationship to ${field.replace('_', ' ')}`;
  }
  
  return '';
}

// Run the analysis
analyzeRelationships(); 