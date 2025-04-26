const fs = require('fs').promises;

async function analyzeRelationships() {
  try {
    // Read individual API responses for more detailed analysis
    const files = [
      'gm-ages.json',
      'gm-categories.json',
      'gm-languages.json',
      'gm-lengths.json',
      'gm-meditations.json',
      'gm-rajyoga-teachers.json'
    ];
    
    const relationshipMap = {};
    
    // Process each file
    for (const file of files) {
      const entityType = file.replace('.json', '');
      const data = JSON.parse(await fs.readFile(`./api_responses/${file}`, 'utf8'));
      
      relationshipMap[entityType] = {
        fields: new Set(),
        relationships: []
      };
      
      // Skip if no data
      if (!data.data || !Array.isArray(data.data)) continue;
      
      // Take a representative sample
      const sampleItems = data.data.slice(0, Math.min(5, data.data.length));
      
      for (const item of sampleItems) {
        if (!item.attributes) continue;
        
        // Process each attribute
        for (const [key, value] of Object.entries(item.attributes)) {
          relationshipMap[entityType].fields.add(key);
          
          // Check for relationships (Strapi patterns)
          if (value && typeof value === 'object') {
            // Handle nested data structure
            if (value.data) {
              const isMultiple = Array.isArray(value.data);
              let relatedType = '';
              
              if (isMultiple && value.data.length > 0 && value.data[0].type) {
                relatedType = value.data[0].type;
              } else if (value.data && value.data.type) {
                relatedType = value.data.type;
              }
              
              if (relatedType) {
                // Add this relationship if not already added
                if (!relationshipMap[entityType].relationships.some(r => 
                  r.field === key && r.relatedType === relatedType)) {
                  relationshipMap[entityType].relationships.push({
                    field: key,
                    relationType: isMultiple ? 'many' : 'one',
                    relatedType
                  });
                }
              }
            }
          }
        }
      }
      
      // Convert field sets to arrays
      relationshipMap[entityType].fields = Array.from(relationshipMap[entityType].fields);
    }
    
    // Generate improved documentation
    let markdown = '# Brahma Kumaris Guided Meditation API Relationships\n\n';
    
    // Entity details section
    markdown += '## Entity Details\n\n';
    
    for (const entityType of Object.keys(relationshipMap)) {
      markdown += `### ${entityType}\n\n`;
      
      // Field table
      markdown += '#### Fields\n\n';
      markdown += '| Field | Type |\n';
      markdown += '|-------|------|\n';
      
      for (const field of relationshipMap[entityType].fields) {
        const isRelationship = relationshipMap[entityType].relationships.some(r => r.field === field);
        markdown += `| \`${field}\` | ${isRelationship ? 'Relationship' : 'Attribute'} |\n`;
      }
      
      // Relationships specific to this entity
      if (relationshipMap[entityType].relationships.length > 0) {
        markdown += '\n#### Relationships\n\n';
        markdown += '| Relationship Type | Related Entity | Via Field |\n';
        markdown += '|-------------------|---------------|----------|\n';
        
        for (const relation of relationshipMap[entityType].relationships) {
          markdown += `| Has ${relation.relationType === 'many' ? 'Many' : 'One'} | ${relation.relatedType} | \`${relation.field}\` |\n`;
        }
      }
      
      markdown += '\n';
    }
    
    // Comprehensive relationships section
    markdown += '## Complete Relationship Map\n\n';
    markdown += '| From Entity | Relationship | To Entity | Through Field |\n';
    markdown += '|-------------|--------------|-----------|---------------|\n';
    
    for (const entityType of Object.keys(relationshipMap)) {
      for (const relation of relationshipMap[entityType].relationships) {
        markdown += `| ${entityType} | Has ${relation.relationType === 'many' ? 'Many' : 'One'} | ${relation.relatedType} | \`${relation.field}\` |\n`;
      }
    }
    
    // Visual diagram
    markdown += '\n## Visual Relationship Diagram\n\n';
    markdown += '```\n';
    
    // Create entity boxes
    for (const entityType of Object.keys(relationshipMap)) {
      markdown += `[${entityType}]\n`;
      
      // Add connection lines for relationships
      for (const relation of relationshipMap[entityType].relationships) {
        const arrow = relation.relationType === 'many' ? '---*' : '---->';
        markdown += `  ${arrow} [${relation.relatedType}] (via ${relation.field})\n`;
      }
      
      markdown += '\n';
    }
    
    markdown += '```\n\n';
    
    // Add a section about Strapi relationships
    markdown += '## Understanding Strapi Relationships\n\n';
    markdown += 'Strapi uses a structured format for representing relationships:\n\n';
    markdown += '- **One-to-One**: A single record relates to a single record in another collection\n';
    markdown += '- **One-to-Many**: A single record relates to multiple records in another collection\n';
    markdown += '- **Many-to-Many**: Multiple records relate to multiple records in another collection\n\n';
    markdown += 'When querying the API, use the `populate` parameter to include related data:\n\n';
    markdown += '- `?populate=*` - includes all first-level relationships\n';
    markdown += '- `?populate=deep` - includes deeper nested relationships\n';
    markdown += '- `?populate[0]=field1&populate[1]=field2` - includes specific relationships\n\n';
    markdown += 'Example: `GET /api/gm-meditations?populate=gm_categories,gm_language`\n';
    
    // Write the enhanced relationship diagram
    await fs.writeFile('./api_responses/enhanced_relationships.md', markdown);
    console.log('Enhanced relationship diagram created at api_responses/enhanced_relationships.md');
    
  } catch (error) {
    console.error('Error analyzing relationships:', error);
  }
}

// Execute
analyzeRelationships(); 