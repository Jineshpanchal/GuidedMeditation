const fs = require('fs').promises;

async function generateVisualRelationships() {
  try {
    // Read the API data
    const allData = JSON.parse(await fs.readFile('./api_responses/all_data.json', 'utf8'));
    const relationships = {};
    
    // Define entity types we're interested in
    const entityTypes = [
      'gm-ages',
      'gm-categories',
      'gm-languages',
      'gm-lengths',
      'gm-meditations',
      'gm-rajyoga-teachers'
    ];
    
    // Analyze each entity type
    for (const entityType of entityTypes) {
      if (!allData[entityType] || !allData[entityType].data) continue;
      
      relationships[entityType] = {
        fields: new Set(),
        relationships: []
      };
      
      // Get a sample item
      const sampleItems = allData[entityType].data.slice(0, 5);
      
      for (const item of sampleItems) {
        if (!item.attributes) continue;
        
        // Collect all field names
        Object.keys(item.attributes).forEach(field => {
          relationships[entityType].fields.add(field);
          
          // Check if this field represents a relationship
          const value = item.attributes[field];
          if (value && typeof value === 'object' && value.data) {
            // Found a relationship
            const isMultiple = Array.isArray(value.data);
            let relatedType = '';
            
            if (isMultiple && value.data.length > 0) {
              relatedType = value.data[0].type;
            } else if (value.data && value.data.type) {
              relatedType = value.data.type;
            }
            
            if (relatedType && !relationships[entityType].relationships.some(r => 
              r.field === field && r.relatedType === relatedType)) {
              relationships[entityType].relationships.push({
                field,
                relationType: isMultiple ? 'many' : 'one',
                relatedType
              });
            }
          }
        });
      }
      
      // Convert the Set to an Array
      relationships[entityType].fields = Array.from(relationships[entityType].fields);
    }
    
    // Generate a markdown representation of the relationships
    let markdown = '# API Relationships Diagram\n\n';
    
    // Fields table for each entity
    markdown += '## Entity Fields\n\n';
    
    for (const entityType of Object.keys(relationships)) {
      markdown += `### ${entityType}\n\n`;
      markdown += '| Field | Type |\n';
      markdown += '|-------|------|\n';
      
      for (const field of relationships[entityType].fields) {
        const isRelationship = relationships[entityType].relationships.some(r => r.field === field);
        markdown += `| \`${field}\` | ${isRelationship ? 'Relationship' : 'Attribute'} |\n`;
      }
      
      markdown += '\n';
    }
    
    // Relationships table
    markdown += '## Entity Relationships\n\n';
    markdown += '| From Entity | Relationship | To Entity | Through Field |\n';
    markdown += '|-------------|--------------|-----------|---------------|\n';
    
    for (const entityType of Object.keys(relationships)) {
      for (const relation of relationships[entityType].relationships) {
        markdown += `| ${entityType} | ${relation.relationType === 'many' ? 'Has Many' : 'Has One'} | ${relation.relatedType} | \`${relation.field}\` |\n`;
      }
    }
    
    // Simple visual diagram using ASCII
    markdown += '\n## Visual Diagram\n\n';
    markdown += '```\n';
    
    // Create a simple relationship diagram
    const diagramEntities = Object.keys(relationships);
    
    for (const entity of diagramEntities) {
      markdown += `[${entity}]\n`;
      
      for (const relation of relationships[entity].relationships) {
        const arrow = relation.relationType === 'many' ? '---*' : '---->';
        markdown += `  ${arrow} [${relation.relatedType}] (via ${relation.field})\n`;
      }
      
      markdown += '\n';
    }
    
    markdown += '```\n';
    
    // Save the markdown file
    await fs.writeFile('./api_responses/relationships_diagram.md', markdown);
    console.log('Relationship diagram created at api_responses/relationships_diagram.md');
    
  } catch (error) {
    console.error('Error generating relationship diagram:', error);
  }
}

// Execute the function
generateVisualRelationships(); 