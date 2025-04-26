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
  
  // Standard response validation
  if (!response || !response.data) {
    console.error('Invalid API response structure');
    return { data: { data: [] } };
  }
  
  return response;
};

export const getAgeGroups = async (params = {}) => {
  try {
    console.log('Fetching age groups from API...');
    const response = await strapiApi.get('/gm-ages', { params });
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching age groups:', error.message);
    return [];
  }
};

export const getCategories = async (params = {}) => {
  try {
    const response = await strapiApi.get('/gm-categories', { params });
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    return [];
  }
};

export const getMeditations = async (params = {}) => {
  try {
    const response = await strapiApi.get('/gm-meditations', { params });
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching meditations:', error.message);
    return [];
  }
};

export const getMeditationBySlug = async (slug, params = {}) => {
  try {
    const defaultParams = {
      'filters[Slug][$eq]': slug,
      'fields[0]': 'Title',
      'fields[1]': 'Slug', 
      'fields[2]': 'DisplayTitle',
      'fields[3]': 'Duration',
      'fields[4]': 'CommentaryLyrics',
      'fields[5]': 'BenefitsShort',
      'fields[6]': 'BenefitsBig',
      'fields[7]': 'Trending',
      // Optimize image and media loading
      'populate[FeaturedImage][fields][0]': 'formats',
      'populate[FeaturedImage][fields][1]': 'url',
      'populate[Media]': '*',
      // Related entities with optimized fields
      'populate[gm_categories][fields][0]': 'Category',
      'populate[gm_categories][fields][1]': 'CategoryDisplay',
      'populate[gm_language][fields][0]': 'Language',
      'populate[gm_language][fields][1]': 'Slug',
      'populate[gm_length][fields][0]': 'Length',
      // Teacher with optimized image
      'populate[gm_rajyoga_teachers][fields][0]': 'Name',
      'populate[gm_rajyoga_teachers][fields][1]': 'Slug',
      'populate[gm_rajyoga_teachers][fields][2]': 'Designation',
      'populate[gm_rajyoga_teachers][fields][3]': 'ShortIntro',
      'populate[gm_rajyoga_teachers][populate][FeaturedImage][fields][0]': 'formats',
      'populate[gm_rajyoga_teachers][populate][FeaturedImage][fields][1]': 'url',
      ...params
    };
    
    const response = await strapiApi.get('/gm-meditations', {
      params: defaultParams
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

export const getLanguages = async (params = {}) => {
  try {
    const response = await strapiApi.get('/gm-languages', { params });
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching languages:', error.message);
    return [];
  }
};

export const getLengths = async (params = {}) => {
  try {
    const response = await strapiApi.get('/gm-lengths', { params });
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching lengths:', error.message);
    return [];
  }
};

export const getTeachers = async (params = {}) => {
  try {
    // Only request necessary fields by default
    const defaultParams = {
      'fields[0]': 'Name',
      'fields[1]': 'Slug',
      'fields[2]': 'Designation',
      'populate[FeaturedImage][fields][0]': 'formats',
      'populate[FeaturedImage][fields][1]': 'url',
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

export const getTeacherBySlug = async (slug, params = {}) => {
  try {
    // Create default parameters that specifically target only HD format images
    const defaultParams = {
      'filters[Slug][$containsi]': slug,
      'fields[0]': 'Name',
      'fields[1]': 'Slug', 
      'fields[2]': 'Designation',
      'fields[3]': 'ShortIntro',
      'fields[4]': 'BigIntro',
      'fields[5]': 'KnowMore',
      // Specific population for FeaturedImage that only gets the HD format
      'populate[FeaturedImage][fields][0]': 'name',
      'populate[FeaturedImage][fields][1]': 'formats',
      'populate[FeaturedImage][fields][2]': 'url',
      ...params
    };
    
    const response = await strapiApi.get('/gm-rajyoga-teachers', {
      params: defaultParams,
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

export const getCategoriesByAgeGroup = async (ageGroupSlug, params = {}) => {
  try {
    // Get the age group with its categories using the gm_categories relationship
    // Only load the specific fields we need
    const defaultParams = {
      'filters[slug][$eq]': ageGroupSlug,
      'populate[gm_categories][fields][0]': 'Category',
      'populate[gm_categories][fields][1]': 'slug',
      'populate[gm_categories][fields][2]': 'ShortIntro',
      'populate[gm_categories][fields][3]': 'CategoryDisplay',
      'populate[gm_categories][populate][FeaturedImage][fields][0]': 'url',
      ...params
    };
    
    const response = await strapiApi.get('/gm-ages', { params: defaultParams });
    
    const validatedResponse = validateStrapiResponse(response);
    const ageGroup = validatedResponse.data.data?.[0];
    
    if (!ageGroup) {
      console.warn(`Age group not found: ${ageGroupSlug}`);
      return [];
    }
    
    // Get categories from the gm_categories relationship
    const categories = ageGroup.attributes?.gm_categories?.data || [];
    
    // Process each category to ensure ShortIntro is in a consistent format
    const processedCategories = categories.map(category => {
      if (category.attributes.ShortIntro && 
          typeof category.attributes.ShortIntro === 'object' &&
          !Array.isArray(category.attributes.ShortIntro)) {
        // Convert to string if it's a non-array object
        category.attributes.ShortIntro = category.attributes.ShortIntro.toString();
      }
      return category;
    });
    
    console.log(`Found ${processedCategories.length} categories for age group: ${ageGroupSlug}`);
    
    return processedCategories;
  } catch (error) {
    console.error(`Error fetching categories for age group ${ageGroupSlug}:`, error);
    return [];
  }
};

export const getMeditationsByCategory = async (categoryId, categorySlug = null, params = {}) => {
  try {
    const filters = categoryId 
      ? { 'filters[category][id][$eq]': categoryId }
      : { 'filters[category][slug][$eq]': categorySlug };
    
    const defaultParams = {
      ...filters,
      'populate': 'deep',
      ...params
    };
      
    const response = await strapiApi.get('/gm-meditations', { params: defaultParams });
    
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error(`Error fetching meditations for category ${categoryId || categorySlug}:`, error);
    return [];
  }
};

export const getTrendingMeditationsByAgeGroup = async (ageGroupSlug) => {
  try {
    // First get the age group with its categories, but only populate what's needed
    const ageGroupResponse = await strapiApi.get('/gm-ages', {
      params: {
        'filters[slug][$eq]': ageGroupSlug,
        'populate[gm_categories]': '*', // Only populate categories, not deep
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
    
    // Get all category IDs from these categories
    const categoryIds = categories.map(category => category.id);
    
    if (categoryIds.length === 0) {
      return [];
    }
    
    // Now get trending meditations that belong to these categories
    // Only populate the fields we actually need for the UI
    const meditationsResponse = await strapiApi.get('/gm-meditations', {
      params: {
        'filters[gm_categories][id][$in]': categoryIds,
        'filters[Trending][$eq]': true,
        'populate[FeaturedImage][fields][0]': 'url', // Only get the URL, not all image formats
        'populate[gm_rajyoga_teachers][fields][0]': 'Name', // Only get the teacher name
        'fields[0]': 'Title',
        'fields[1]': 'Slug',
        'fields[2]': 'Duration',
        'fields[3]': 'Trending',
        'fields[4]': 'DisplayTitle',
        'pagination[limit]': 8 // Limit the number of trending meditations
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
        'fields[0]': 'Name',
        'fields[1]': 'Slug', 
        'fields[2]': 'Designation',
        'fields[3]': 'ShortIntro',
        'fields[4]': 'BigIntro',
        'fields[5]': 'KnowMore',
        // Specific population for FeaturedImage that only gets the format data
        'populate[FeaturedImage][fields][0]': 'name',
        'populate[FeaturedImage][fields][1]': 'formats',
        'populate[FeaturedImage][fields][2]': 'url',
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
        'filters[id][$eq]': teacherId,
        'fields[0]': 'Name',
        'fields[1]': 'Slug', 
        'fields[2]': 'Designation',
        'fields[3]': 'ShortIntro',
        'fields[4]': 'BigIntro',
        'fields[5]': 'KnowMore',
        'populate[FeaturedImage][fields][0]': 'formats',
        'populate[FeaturedImage][fields][1]': 'url',
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