import axios from 'axios';

const API_URL = 'https://webapp.brahmakumaris.com/api';
const API_TOKEN = 'e8afa458e2e8652c4dc4825f99d7cf799032c77f6ef66bd6508a68f41c0219b3254a1cfad27a9eb8b53358ea971523adc4c8c2a78ca1eeaeb37ab3214862bb958eacd289aa50073349697300d856d0d8c6d4fa88ab394a5d4f52cdd99f68f5bf77ae1baf022f165201ccf9c11dcbac4f979e97ed4dd6d7d4625280a0769b7fc1';

const strapiApi = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Origin': 'https://brahmakumaris.com',
    'Referer': 'https://brahmakumaris.com/'
  },
  timeout: 15000 // 15 second timeout
});

// Helper to validate response and handle common errors
const validateStrapiResponse = (response) => {
  // Check if response is HTML (Cloudflare block) instead of JSON
  if (typeof response.data === 'string' && response.data.includes('Cloudflare')) {
    console.error('API ACCESS BLOCKED BY CLOUDFLARE');
    return { data: { data: [] } };
  }
  
  // Ensure response has expected structure
  if (!response.data || !response.data.data) {
    console.warn('Unexpected API response structure');
    return { data: { data: [] } };
  }
  
  return response;
};

export const getAgeGroups = async () => {
  try {
    console.log('Fetching age groups from API...');
    const response = await strapiApi.get('/gm-ages');
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching age groups:', error.message);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await strapiApi.get('/gm-categories');
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getMeditations = async (params = {}) => {
  try {
    // Ensure deep population for media fields unless specified otherwise
    const defaultParams = {
      'populate[CoverImage]': '*',
      ...params
    };
    
    const response = await strapiApi.get('/gm-meditations', { params: defaultParams });
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching meditations:', error.message);
    return [];
  }
};

export const getMeditationBySlug = async (slug) => {
  try {
    const response = await strapiApi.get('/gm-meditations', {
      params: {
        'filters[Slug][$containsi]': slug,
        'populate[CoverImage]': '*',
        'populate[Media]': '*',
        'populate[FeaturedImage]': '*',
        'populate[gm_categories]': '*',
        'populate[gm_language]': '*',
        'populate[gm_rajyoga_teacher]': '*'
      },
    });
    
    const validatedResponse = validateStrapiResponse(response);
    const data = validatedResponse.data.data || [];
    
    if (data.length === 0) {
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error(`Error fetching meditation with slug ${slug}:`, error.message);
    return null;
  }
};

export const getLanguages = async () => {
  try {
    const response = await strapiApi.get('/gm-languages');
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching languages:', error);
    return [];
  }
};

export const getLengths = async () => {
  try {
    const response = await strapiApi.get('/gm-lengths');
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching lengths:', error);
    return [];
  }
};

export const getTeachers = async (params = {}) => {
  try {
    // Ensure deep population for media fields unless specified otherwise
    const defaultParams = {
      'populate[FeaturedImage]': '*',
      ...params
    };
    
    const response = await strapiApi.get('/gm-rajyoga-teachers', { params: defaultParams });
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching teachers:', error.message);
    return [];
  }
};

export const getTeacherBySlug = async (slug) => {
  try {
    const response = await strapiApi.get('/gm-rajyoga-teachers', {
      params: {
        'filters[Slug][$containsi]': slug,
        'populate[FeaturedImage]': '*',
        'populate[meditations]': '*'
      },
    });
    
    const validatedResponse = validateStrapiResponse(response);
    const data = validatedResponse.data.data || [];
    
    if (data.length === 0) {
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error(`Error fetching teacher with slug ${slug}:`, error.message);
    return null;
  }
};

export const getCategoriesByAgeGroup = async (ageGroupSlug) => {
  try {
    // Get the age group with its categories using the gm_categories relationship
    const response = await strapiApi.get('/gm-ages', {
      params: {
        'filters[slug][$eq]': ageGroupSlug,
        'populate[gm_categories]': '*'  // Get all categories related to this age group
      }
    });
    
    const validatedResponse = validateStrapiResponse(response);
    const ageGroup = validatedResponse.data.data?.[0];
    
    if (!ageGroup) {
      console.warn(`Age group not found: ${ageGroupSlug}`);
      return [];
    }
    
    // Get categories from the gm_categories relationship
    const categories = ageGroup.attributes?.gm_categories?.data || [];
    console.log(`Found ${categories.length} categories for age group: ${ageGroupSlug}`);
    
    return categories;
  } catch (error) {
    console.error(`Error fetching categories for age group ${ageGroupSlug}:`, error);
    return [];
  }
};

export const getMeditationsByCategory = async (categoryId, categorySlug = null) => {
  try {
    const filters = categoryId 
      ? { 'filters[category][id][$eq]': categoryId }
      : { 'filters[category][slug][$eq]': categorySlug };
      
    const response = await strapiApi.get('/gm-meditations', {
      params: {
        ...filters,
        'populate[CoverImage]': '*',
        'populate[teacher]': '*'
      }
    });
    
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error(`Error fetching meditations for category ${categoryId || categorySlug}:`, error);
    return [];
  }
};

export const getTrendingMeditationsByAgeGroup = async (ageGroupSlug) => {
  try {
    // First get the age group with its categories
    const ageGroupResponse = await strapiApi.get('/gm-ages', {
      params: {
        'filters[slug][$eq]': ageGroupSlug,
        'populate[gm_categories][populate][gm_meditations]': '*'  // Deep populate categories and their meditations
      }
    });
    
    const validatedResponse = validateStrapiResponse(ageGroupResponse);
    const ageGroup = validatedResponse.data.data?.[0];
    
    if (!ageGroup) {
      console.warn(`Age group not found: ${ageGroupSlug}`);
      return [];
    }
    
    // Get all categories for this age group
    const categories = ageGroup.attributes?.gm_categories?.data || [];
    
    // Get all meditation IDs from these categories
    const meditationIds = categories.flatMap(category => 
      category.attributes?.gm_meditations?.data?.map(meditation => meditation.id) || []
    );
    
    if (meditationIds.length === 0) {
      return [];
    }
    
    // Now get trending meditations that belong to these categories
    const meditationsResponse = await strapiApi.get('/gm-meditations', {
      params: {
        'filters[id][$in]': meditationIds,
        'filters[Trending][$eq]': true,
        'populate[CoverImage]': '*',
        'populate[teacher]': '*',
        'populate[category]': '*'
      }
    });
    
    const validatedMeditationsResponse = validateStrapiResponse(meditationsResponse);
    return validatedMeditationsResponse.data.data || [];
  } catch (error) {
    console.error(`Error fetching trending meditations for age group ${ageGroupSlug}:`, error);
    return [];
  }
};

export const getTeacherById = async (teacherId) => {
  try {
    if (!teacherId) {
      console.error("No teacher ID provided to getTeacherById");
      return null;
    }
    
    console.log(`Fetching teacher with ID: ${teacherId}`);
    
    const response = await strapiApi.get(`/gm-rajyoga-teachers/${teacherId}`, {
      params: {
        'populate[FeaturedImage]': '*',
        'populate[gm_meditations]': '*'
      }
    });
    
    // Log complete response for debugging
    console.log(`Teacher API response status: ${response.status}`);
    console.log(`Teacher data structure:`, JSON.stringify(response.data).substring(0, 100) + "...");
    
    const validatedResponse = validateStrapiResponse(response);
    if (!validatedResponse.data.data) {
      console.error(`No teacher data found for ID: ${teacherId}`);
      return null;
    }
    
    return validatedResponse.data.data;
  } catch (error) {
    console.error(`Error fetching teacher with id ${teacherId}:`, error.message);
    // Fallback to alternate method if direct fetch fails
    try {
      console.log(`Trying alternate method to fetch teacher ${teacherId}`);
      const allTeachers = await getTeachers({
        'filters[id][$eq]': teacherId
      });
      
      if (allTeachers && allTeachers.length > 0) {
        console.log(`Found teacher via alternate method: ${allTeachers[0].attributes.Name || 'Unknown'}`);
        return allTeachers[0];
      }
      
      return null;
    } catch (fallbackError) {
      console.error("Fallback teacher fetch also failed:", fallbackError.message);
      return null;
    }
  }
};

export default {
  getAgeGroups,
  getCategories,
  getMeditations,
  getMeditationBySlug,
  getLanguages,
  getLengths,
  getTeachers,
  getTeacherBySlug,
  getCategoriesByAgeGroup,
  getMeditationsByCategory,
  getTrendingMeditationsByAgeGroup,
  getTeacherById
}; 