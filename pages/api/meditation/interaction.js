import axios from 'axios';

const API_URL = 'https://portal.brahmakumaris.com/api';
const API_TOKEN = 'a76a90d91fd0e715531c8e5a8d2cf9bd086773db9e7e69e09e0bf8376460f8c1e6b6cb62fb66a156560bdc73134997650864c8e6403cee6b070cdd5e5ff28ca48ee46b68d1bd5d0ddc8515e5d3f2294a9b7348636cb7e96f5ea1136718208e255b2f7692e1296f4b0b921a423e3f6f517329c050b223210a9c29bd0900ce2196';

const strapiApi = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Origin': 'https://brahmakumaris.com',
    'Referer': 'https://brahmakumaris.com/'
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { meditationId, action, value } = req.body;

    if (!meditationId || !action || (action !== 'listened' && action !== 'like')) {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }

    // Get current meditation data
    const getMeditationResponse = await strapiApi.get(`/gm-meditations/${meditationId}`);

    if (!getMeditationResponse.data?.data?.attributes) {
      return res.status(404).json({ message: 'Meditation not found' });
    }

    const currentData = getMeditationResponse.data.data.attributes;
    const currentAttributes = { ...currentData };

    // Update the specific field
    if (action === 'listened') {
      const currentCount = parseInt(currentAttributes.Listened || '0', 10);
      currentAttributes.Listened = String(currentCount + 1);
    } else if (action === 'like') {
      const currentCount = parseInt(currentAttributes.like || '0', 10);
      currentAttributes.like = String(value ? currentCount + 1 : Math.max(0, currentCount - 1));
    }

    console.log('Current meditation data:', currentData);
    console.log('Updating meditation with data:', currentAttributes);

    // Update meditation in Strapi with all current attributes
    const updateResponse = await strapiApi.put(
      `/gm-meditations/${meditationId}`,
      {
        data: {
          ...currentAttributes,
          // Ensure these required fields are included
          Title: currentAttributes.Title,
          Slug: currentAttributes.Slug,
          DisplayTitle: currentAttributes.DisplayTitle,
          Duration: currentAttributes.Duration,
          Trending: currentAttributes.Trending
        }
      }
    );

    if (!updateResponse.data?.data?.attributes) {
      console.error('Update response:', updateResponse.data);
      throw new Error('Invalid response from update API');
    }

    const updatedData = updateResponse.data.data.attributes;
    
    // Return the updated values
    return res.status(200).json({
      success: true,
      data: {
        [action]: action === 'listened' 
          ? parseInt(updatedData.Listened || '0', 10)
          : parseInt(updatedData.like || '0', 10)
      }
    });
  } catch (error) {
    console.error('Error updating meditation:', error);
    return res.status(500).json({ 
      message: 'Failed to update meditation', 
      error: error.message,
      details: error.response?.data 
    });
  }
} 