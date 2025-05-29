import axios from 'axios';
// Remove cacheWrapper import since we're removing response caching
// import { cacheWrapper, generateCacheKey } from '../cache.js';

const API_URL = 'https://portal.brahmakumaris.com/api';
const API_TOKEN = 'a76a90d91fd0e715531c8e5a8d2cf9bd086773db9e7e69e09e0bf8376460f8c1e6b6cb62fb66a156560bdc73134997650864c8e6403cee6b070cdd5e5ff28ca48ee46b68d1bd5d0ddc8515e5d3f2294a9b7348636cb7e96f5ea1136718208e255b2f7692e1296f4b0b921a423e3f6f517329c050b223210a9c29bd0900ce2196';

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

// Optimized field selections for different use cases
const FIELD_PRESETS = {
  ageGroups: {
    minimal: {
      'fields[0]': 'name',
      'fields[1]': 'spectrum',
      'fields[2]': 'slug',
    },
    withImage: {
      'fields[0]': 'name',
      'fields[1]': 'spectrum',
      'fields[2]': 'slug',
      'fields[3]': 'ShortBio',
      'populate[featuredimage][fields][0]': 'url',
      'populate[featuredimage][fields][1]': 'formats',
    },
    withCategories: {
      'fields[0]': 'name',
      'fields[1]': 'spectrum',
      'fields[2]': 'slug',
      'fields[3]': 'ShortBio',
      'populate[featuredimage][fields][0]': 'url',
      'populate[gm_categories][fields][0]': 'Category',
      'populate[gm_categories][fields][1]': 'slug',
      'populate[gm_categories][fields][2]': 'CategoryDisplay',
      'populate[gm_categories][populate][FeaturedImage][fields][0]': 'url',
    }
  },
  meditations: {
    minimal: {
      'fields[0]': 'Title',
      'fields[1]': 'Slug',
      'fields[2]': 'Duration',
      'fields[3]': 'Trending',
    },
    card: {
      'fields[0]': 'Title',
      'fields[1]': 'Slug',
      'fields[2]': 'Duration',
      'fields[3]': 'Trending',
      'fields[4]': 'DisplayTitle',
      'fields[5]': 'Listened',
      'fields[6]': 'like',
      'populate[FeaturedImage][fields][0]': 'url',
      'populate[gm_rajyoga_teachers][fields][0]': 'Name',
      'populate[Media][fields][0]': 'url',
    },
    full: {
      'fields[0]': 'Title',
      'fields[1]': 'Slug',
      'fields[2]': 'DisplayTitle',
      'fields[3]': 'Duration',
      'fields[4]': 'CommentaryLyrics',
      'fields[5]': 'BenefitsShort',
      'fields[6]': 'BenefitsBig',
      'fields[7]': 'Trending',
      'fields[8]': 'Listened',
      'fields[9]': 'like',
      'populate[FeaturedImage][fields][0]': 'url',
      'populate[FeaturedImage][fields][1]': 'formats',
      'populate[Media]': '*',
      'populate[gm_categories][fields][0]': 'Category',
      'populate[gm_categories][fields][1]': 'CategoryDisplay',
      'populate[gm_language][fields][0]': 'Language',
      'populate[gm_rajyoga_teachers][fields][0]': 'Name',
      'populate[gm_rajyoga_teachers][fields][1]': 'Slug',
      'populate[gm_rajyoga_teachers][fields][2]': 'Designation',
    }
  },
  teachers: {
    minimal: {
      'fields[0]': 'Name',
      'fields[1]': 'Slug',
      'fields[2]': 'Designation',
    },
    card: {
      'fields[0]': 'Name',
      'fields[1]': 'Slug',
      'fields[2]': 'Designation',
      'fields[3]': 'ShortIntro',
      'populate[FeaturedImage][fields][0]': 'url',
    },
    full: {
      'fields[0]': 'Name',
      'fields[1]': 'Slug',
      'fields[2]': 'Designation',
      'fields[3]': 'ShortIntro',
      'fields[4]': 'BigIntro',
      'fields[5]': 'KnowMore',
      'populate[FeaturedImage][fields][0]': 'url',
      'populate[FeaturedImage][fields][1]': 'formats',
    }
  },
  categories: {
    minimal: {
      'fields[0]': 'Category',
      'fields[1]': 'slug',
      'fields[2]': 'CategoryDisplay',
    },
    card: {
      'fields[0]': 'Category',
      'fields[1]': 'slug',
      'fields[2]': 'CategoryDisplay',
      'fields[3]': 'ShortIntro',
      'populate[FeaturedImage][fields][0]': 'url',
    }
  }
};

// Optimized Age Groups API
export const getAgeGroups = async (preset = 'minimal', customParams = {}) => {
  const params = { ...FIELD_PRESETS.ageGroups[preset], ...customParams };
  
  // Remove cacheWrapper - fetch fresh data each time
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

// Optimized Meditations API
export const getMeditations = async (preset = 'card', customParams = {}) => {
  const params = { ...FIELD_PRESETS.meditations[preset], ...customParams };
  
  // Remove cacheWrapper - fetch fresh data each time
  try {
    const response = await strapiApi.get('/gm-meditations', { params });
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching meditations:', error.message);
    return [];
  }
};

// Optimized Teachers API
export const getTeachers = async (preset = 'card', customParams = {}) => {
  const params = { ...FIELD_PRESETS.teachers[preset], ...customParams };
  
  // Remove cacheWrapper - fetch fresh data each time
  try {
    const response = await strapiApi.get('/gm-rajyoga-teachers', { params });
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching teachers:', error.message);
    return [];
  }
};

// Optimized Categories API
export const getCategories = async (preset = 'card', customParams = {}) => {
  const params = { ...FIELD_PRESETS.categories[preset], ...customParams };
  
  // Remove cacheWrapper - fetch fresh data each time
  try {
    const response = await strapiApi.get('/gm-categories', { params });
    const validatedResponse = validateStrapiResponse(response);
    return validatedResponse.data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    return [];
  }
};

// Optimized function to get categories by age group
export const getCategoriesByAgeGroup = async (ageGroupSlug) => {
  // Remove cacheWrapper - fetch fresh data each time
  try {
    const params = {
      'filters[slug][$eq]': ageGroupSlug,
      'populate[gm_categories][fields][0]': 'Category',
      'populate[gm_categories][fields][1]': 'slug',
      'populate[gm_categories][fields][2]': 'ShortIntro',
      'populate[gm_categories][fields][3]': 'CategoryDisplay',
      'populate[gm_categories][populate][FeaturedImage][fields][0]': 'url',
    };
    
    const response = await strapiApi.get('/gm-ages', { params });
    const validatedResponse = validateStrapiResponse(response);
    const ageGroup = validatedResponse.data.data?.[0];
    
    if (!ageGroup) {
      console.warn(`Age group not found: ${ageGroupSlug}`);
      return [];
    }
    
    const categories = ageGroup.attributes?.gm_categories?.data || [];
    
    // Process each category to ensure ShortIntro is in a consistent format
    const processedCategories = categories.map(category => {
      if (category.attributes.ShortIntro && 
          typeof category.attributes.ShortIntro === 'object' &&
          !Array.isArray(category.attributes.ShortIntro)) {
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

// Optimized function to get trending meditations by age group
export const getTrendingMeditationsByAgeGroup = async (ageGroupSlug) => {
  // Remove cacheWrapper - fetch fresh data each time
  try {
    // First get the age group with its categories
    const ageGroupResponse = await strapiApi.get('/gm-ages', {
      params: {
        'filters[slug][$eq]': ageGroupSlug,
        'populate[gm_categories][fields][0]': 'id',
      }
    });
    
    const validatedResponse = validateStrapiResponse(ageGroupResponse);
    const ageGroup = validatedResponse.data.data?.[0];
    
    if (!ageGroup) {
      console.warn(`Age group not found: ${ageGroupSlug}`);
      return [];
    }
    
    const categories = ageGroup.attributes?.gm_categories?.data || [];
    const categoryIds = categories.map(category => category.id);
    
    if (categoryIds.length === 0) {
      return [];
    }
    
    // Get trending meditations for these categories
    const meditationsResponse = await strapiApi.get('/gm-meditations', {
      params: {
        'filters[gm_categories][id][$in]': categoryIds,
        'filters[Trending][$eq]': true,
        ...FIELD_PRESETS.meditations.card,
        'pagination[limit]': 8
      }
    });
    
    const validatedMeditationsResponse = validateStrapiResponse(meditationsResponse);
    return validatedMeditationsResponse.data.data || [];
  } catch (error) {
    console.error(`Error fetching trending meditations for age group ${ageGroupSlug}:`, error);
    return [];
  }
};

// Batch function to get meditation counts for multiple categories
export const getMeditationCountsByCategories = async (categoryIds) => {
  // Remove cacheWrapper - fetch fresh data each time
  try {
    const counts = {};
    
    // Batch request for all categories at once
    const response = await strapiApi.get('/gm-meditations', {
      params: {
        'filters[gm_categories][id][$in]': categoryIds,
        'fields[0]': 'id',
        'populate[gm_categories][fields][0]': 'id',
        'pagination[limit]': 1000 // High limit to get all meditations
      }
    });
    
    const validatedResponse = validateStrapiResponse(response);
    const meditations = validatedResponse.data.data || [];
    
    // Initialize counts
    categoryIds.forEach(id => counts[id] = 0);
    
    // Count meditations for each category
    meditations.forEach(meditation => {
      const meditationCategories = meditation.attributes?.gm_categories?.data || [];
      meditationCategories.forEach(category => {
        if (counts.hasOwnProperty(category.id)) {
          counts[category.id]++;
        }
      });
    });
    
    return counts;
  } catch (error) {
    console.error('Error fetching meditation counts:', error);
    // Return empty counts object as fallback
    const counts = {};
    categoryIds.forEach(id => counts[id] = 0);
    return counts;
  }
};

// Optimized function to get meditation by slug
export const getMeditationBySlug = async (slug) => {
  // Remove cacheWrapper - fetch fresh data each time
  try {
    const params = {
      'filters[Slug][$eq]': slug,
      ...FIELD_PRESETS.meditations.full
    };
    
    const response = await strapiApi.get('/gm-meditations', { params });
    const validatedResponse = validateStrapiResponse(response);
    const data = validatedResponse.data.data || [];
    
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching meditation with slug ${slug}:`, error.message);
    return null;
  }
};

// Optimized function to get teacher by slug
export const getTeacherBySlug = async (slug) => {
  // Remove cacheWrapper - fetch fresh data each time
  try {
    const params = {
      'filters[Slug][$containsi]': slug,
      ...FIELD_PRESETS.teachers.full
    };
    
    const response = await strapiApi.get('/gm-rajyoga-teachers', { params });
    const validatedResponse = validateStrapiResponse(response);
    const data = validatedResponse.data.data || [];
    
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching teacher with slug ${slug}:`, error.message);
    return null;
  }
};

// Function to get home page data in a single optimized call
export const getHomePageData = async () => {
  // Remove cacheWrapper - fetch fresh data each time
  try {
    // Fetch all required data in parallel
    const [ageGroups, featuredMeditations, teachers] = await Promise.all([
      getAgeGroups('withImage'),
      getMeditations('card', {
        'filters[Trending][$eq]': true,
        'pagination[limit]': 4,
      }),
      getTeachers('card', {
        'pagination[limit]': 10,
      })
    ]);
    
    return {
      ageGroups: ageGroups || [],
      featuredMeditations: featuredMeditations || [],
      teachers: teachers || [],
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      ageGroups: [],
      featuredMeditations: [],
      teachers: [],
    };
  }
};

// Function to get age group page data in optimized calls
export const getAgeGroupPageData = async (ageGroupSlug) => {
  // Remove cacheWrapper - fetch fresh data each time
  try {
    // Get age group data
    const ageGroups = await getAgeGroups('withImage', {
      'filters[slug][$eq]': ageGroupSlug,
    });
    
    const ageGroup = ageGroups.find(group => group.attributes.slug === ageGroupSlug);
    
    if (!ageGroup) {
      return null;
    }
    
    // Get categories and trending meditations in parallel
    const [categories, trendingMeditations] = await Promise.all([
      getCategoriesByAgeGroup(ageGroupSlug),
      getTrendingMeditationsByAgeGroup(ageGroupSlug)
    ]);
    
    // Get meditation counts for all categories in a single batch call
    const categoryIds = categories.map(cat => cat.id);
    const meditationCounts = categoryIds.length > 0 
      ? await getMeditationCountsByCategories(categoryIds)
      : {};
    
    return {
      ageGroup,
      categories,
      trendingMeditations,
      meditationCounts
    };
  } catch (error) {
    console.error(`Error fetching age group page data for ${ageGroupSlug}:`, error);
    return null;
  }
};

// Function to get teachers page data with meditation counts
export const getTeachersPageData = async () => {
  // Remove cacheWrapper - fetch fresh data each time
  try {
    // Fetch teachers and meditations in parallel
    const [teachers, allMeditations] = await Promise.all([
      getTeachers('card', {
        'pagination[limit]': 100
      }),
      getMeditations('minimal', {
        'populate[gm_rajyoga_teachers][fields][0]': 'id',
        'pagination[limit]': 1000
      })
    ]);
    
    console.log(`Found ${teachers.length} teachers`);
    console.log(`Found total ${allMeditations.length} meditations`);
    
    // Create a map to store meditation counts for each teacher
    const meditationCounts = {};
    
    // Process all meditations and count by teacher
    allMeditations.forEach(meditation => {
      const meditationTeachers = meditation.attributes?.gm_rajyoga_teachers?.data;
      
      if (meditationTeachers) {
        if (Array.isArray(meditationTeachers)) {
          meditationTeachers.forEach(teacher => {
            if (teacher && teacher.id) {
              meditationCounts[teacher.id] = (meditationCounts[teacher.id] || 0) + 1;
            }
          });
        } else if (meditationTeachers.id) {
          meditationCounts[meditationTeachers.id] = (meditationCounts[meditationTeachers.id] || 0) + 1;
        }
      }
    });
    
    console.log('Final meditation counts:', meditationCounts);
    
    return {
      teachers,
      meditationCounts
    };
  } catch (error) {
    console.error('Error fetching teachers page data:', error);
    return {
      teachers: [],
      meditationCounts: {}
    };
  }
};

// Function to get individual teacher page data
export const getTeacherPageData = async (teacherSlug) => {
  // Remove cacheWrapper - fetch fresh data each time
  try {
    // Get teacher data
    const teacher = await getTeacherBySlug(teacherSlug);
    
    if (!teacher) {
      return null;
    }
    
    // Get meditations for this teacher
    const meditations = await getMeditations('card', {
      'filters[gm_rajyoga_teachers][id][$eq]': teacher.id,
      'populate[Media]': '*',
      'populate[AudioFile]': '*',
      'pagination[limit]': 50
    });
    
    console.log(`Found ${meditations.length} meditations for teacher ${teacherSlug}`);
    
    return {
      teacher,
      meditations
    };
  } catch (error) {
    console.error(`Error fetching teacher page data for ${teacherSlug}:`, error);
    return null;
  }
};

// Function to get explore page data
export const getExplorePageData = async () => {
  // Remove cacheWrapper - fetch fresh data each time
  try {
    // Fetch meditations with all necessary fields for filtering and display
    const meditations = await getMeditations('card', {
      'populate[Media]': '*',
      'populate[AudioFile]': '*',
      'populate[gm_categories][fields][0]': 'Category',
      'populate[gm_categories][fields][1]': 'CategoryDisplay',
      'populate[gm_language][fields][0]': 'Language',
      'populate[gm_length][fields][0]': 'Length',
      'pagination[limit]': 200
    });
    
    console.log(`Found ${meditations.length} meditations for explore page`);
    
    return {
      meditations
    };
  } catch (error) {
    console.error('Error fetching explore page data:', error);
    return {
      meditations: []
    };
  }
};

// Function to get individual meditation page data
export const getMeditationPageData = async (slug) => {
  // Remove cacheWrapper - fetch fresh data each time
  try {
    // Get meditation data
    const meditation = await getMeditationBySlug(slug);
    
    if (!meditation) {
      return null;
    }
    
    console.log(`Found meditation: ${meditation.attributes.Title || 'Unknown title'}`);
    
    // Get related meditations and teachers in parallel
    const categoryIds = meditation.attributes.gm_categories?.data?.map(cat => cat.id) || [];
    
    const [relatedMeditations, allMeditations] = await Promise.all([
      // Get related meditations from same categories
      categoryIds.length > 0 ? getMeditations('card', {
        'filters[gm_categories][id][$in]': categoryIds,
        'filters[id][$ne]': meditation.id,
        'populate[Media]': '*',
        'pagination[limit]': 4
      }) : Promise.resolve([]),
      
      // Get all meditations for teacher counting
      getMeditations('minimal', {
        'populate[gm_rajyoga_teachers][fields][0]': 'id',
        'populate[gm_rajyoga_teacher][fields][0]': 'id',
        'pagination[limit]': 1000
      })
    ]);
    
    console.log(`Found ${relatedMeditations.length} related meditations by category`);
    
    // Extract teacher IDs from meditation
    let meditationTeacherIds = [];
    
    if (meditation.attributes.gm_rajyoga_teachers?.data) {
      if (Array.isArray(meditation.attributes.gm_rajyoga_teachers.data)) {
        meditationTeacherIds = meditation.attributes.gm_rajyoga_teachers.data.map(t => t.id);
      } else if (meditation.attributes.gm_rajyoga_teachers.data.id) {
        meditationTeacherIds = [meditation.attributes.gm_rajyoga_teachers.data.id];
      }
    }
    
    if (meditation.attributes.gm_rajyoga_teacher?.data?.id) {
      meditationTeacherIds.push(meditation.attributes.gm_rajyoga_teacher.data.id);
    }
    
    // Remove duplicates
    meditationTeacherIds = [...new Set(meditationTeacherIds)];
    
    console.log(`Meditation teacher IDs: ${meditationTeacherIds.join(', ')}`);
    
    // Get teachers for this meditation
    let teachers = [];
    if (meditationTeacherIds.length > 0) {
      const allTeachers = await getTeachers('card', {
        'pagination[limit]': 50
      });
      teachers = allTeachers.filter(t => meditationTeacherIds.includes(t.id));
    }
    
    console.log(`Found ${teachers.length} teachers for this meditation`);
    
    // Calculate meditation counts for teachers
    const meditationCounts = {};
    allMeditations.forEach(med => {
      // Check plural relationship
      const medTeachers = med.attributes?.gm_rajyoga_teachers?.data;
      if (medTeachers) {
        if (Array.isArray(medTeachers)) {
          medTeachers.forEach(t => {
            if (t && t.id) {
              meditationCounts[t.id] = (meditationCounts[t.id] || 0) + 1;
            }
          });
        } else if (medTeachers.id) {
          meditationCounts[medTeachers.id] = (meditationCounts[medTeachers.id] || 0) + 1;
        }
      }
      
      // Check singular relationship
      const medTeacher = med.attributes?.gm_rajyoga_teacher?.data;
      if (medTeacher && medTeacher.id) {
        meditationCounts[medTeacher.id] = (meditationCounts[medTeacher.id] || 0) + 1;
      }
    });
    
    return {
      meditation,
      relatedMeditations,
      teachers,
      meditationCounts
    };
  } catch (error) {
    console.error(`Error fetching meditation page data for ${slug}:`, error);
    return null;
  }
};

export default {
  getAgeGroups,
  getMeditations,
  getTeachers,
  getCategories,
  getCategoriesByAgeGroup,
  getTrendingMeditationsByAgeGroup,
  getMeditationCountsByCategories,
  getMeditationBySlug,
  getTeacherBySlug,
  getHomePageData,
  getAgeGroupPageData,
  getTeachersPageData,
  getTeacherPageData,
  getExplorePageData,
  getMeditationPageData,
  FIELD_PRESETS
}; 