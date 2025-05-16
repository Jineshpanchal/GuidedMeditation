const axios = require('axios');
const fs = require('fs').promises;

const API_BASE_URL = 'https://webapp.brahmakumaris.com/api';
const API_TOKEN = '92b282ac1b112c731a88bbcc817b0582abc4a1bfc59d416628ab852cb6e7c7346103dd9cdd984de6e7b3dc911a8fd01f9e85f720eb820acb3beed2d67cf1a346f410e2faa0c80b8318d122ba52889473575bf85b37d3353292f9113b1d141c37f3dd28f5df8ba19d0aec35ce9ff4a6881fb64f647b5ef5f8c753ba63f2205322';

const ENDPOINTS = [
  '/gm-ages?populate=*',
  '/gm-categories?populate=*',
  '/gm-languages?populate=*',
  '/gm-lengths?populate=*',
  '/gm-meditations?populate=deep',
  '/gm-rajyoga-teachers?populate=*'
];

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function fetchAllData() {
  const responseData = {};
  const relationships = {};

  console.log('Starting API data collection...');

  // Fetch data from each endpoint
  for (const endpoint of ENDPOINTS) {
    const endpointName = endpoint.split('?')[0].slice(1);
    console.log(`Fetching data from ${endpointName}...`);
    
    try {
      const response = await axiosInstance.get(endpoint);
      responseData[endpointName] = response.data;
      
      // Write individual responses to files
      await fs.writeFile(
        `api_responses/${endpointName}.json`, 
        JSON.stringify(response.data, null, 2)
      );
      console.log(`Saved ${endpointName} data`);
      
      // Identify relationships
      analyzeRelationships(endpointName, response.data, relationships);
      
    } catch (error) {
      console.error(`Error fetching ${endpointName}:`, error.message);
      responseData[endpointName] = { error: error.message };
    }
  }

  // Write combined data
  await fs.writeFile(
    'api_responses/all_data.json',
    JSON.stringify(responseData, null, 2)
  );
  
  // Write relationships
  await fs.writeFile(
    'api_responses/relationships.json',
    JSON.stringify(relationships, null, 2)
  );
  
  console.log('Completed API data collection');
  return { responseData, relationships };
}

function analyzeRelationships(endpointName, data, relationships) {
  if (!relationships[endpointName]) {
    relationships[endpointName] = {
      relatedTo: [],
      fields: [],
    };
  }
  
  // If it's a collection, analyze the data structure
  if (data.data && Array.isArray(data.data)) {
    // Get fields from the first item if available
    const firstItem = data.data[0];
    if (firstItem && firstItem.attributes) {
      const attributes = firstItem.attributes;
      
      // Get fields
      relationships[endpointName].fields = Object.keys(attributes);
      
      // Find relationships
      for (const [key, value] of Object.entries(attributes)) {
        if (value && typeof value === 'object' && value.data) {
          // This is likely a relationship
          const relationType = Array.isArray(value.data) ? 'oneToMany' : 'oneToOne';
          let relatedType = '';
          
          if (Array.isArray(value.data) && value.data.length > 0) {
            relatedType = value.data[0].type;
          } else if (value.data && value.data.type) {
            relatedType = value.data.type;
          }
          
          if (relatedType) {
            relationships[endpointName].relatedTo.push({
              field: key,
              relationType,
              relatedEntity: relatedType
            });
          }
        }
      }
    }
  }
}

// Execute the function
fetchAllData()
  .then(() => console.log('All API data collected successfully'))
  .catch(err => console.error('Failed to collect API data:', err)); 