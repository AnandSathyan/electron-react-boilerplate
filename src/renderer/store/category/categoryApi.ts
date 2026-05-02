// src/features/category/categoryAPI.js
import api from '../../app/api/api';
import { ENDPOINTS } from '../../app/api/apiEndPoint';

export const fetchCategoriesFromAPI = async (data: any) => {
  try {

    const response = await api.post(ENDPOINTS.GET_CATEGORIES, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });


    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching categories:');
    console.error('  Message:', error.message);
    console.error('  Name:', error.name);
    console.error('  Stack:', error.stack);

    if (error.response) {
      console.error('  Status:', error.response.status);
      console.error('  Data:', error.response.data);
    } else if (error.request) {
      console.error('  Request:', error.request);
    } else {
      console.error('  Config:', error.config);
    }

    throw new Error('Error fetching categories: ' + error.message);
  }
};
