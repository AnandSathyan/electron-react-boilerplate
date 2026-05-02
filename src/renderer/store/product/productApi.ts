// src/features/product/productApi.js
import api from '../../app/api/api';
import { ENDPOINTS } from '../../app/api/apiEndPoint';
import qs from 'qs';

export const submitProductData = async ({ registrationNumber, companyId, BrandId }:any) => {
  
  const productData = {
    RegistrationNo: registrationNumber || '',
    Pass: 'Admin',
    CompanyID: companyId,
    BrandID: BrandId,
    IsModifire:false,
    Status:"Active"
  };

  try {
    const response = await api.post(
      ENDPOINTS.FETCH_PRODUCTS,
      qs.stringify(productData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response?.data) {
      throw new Error("Empty response from server");
    }

    return response?.data;
    ;

  } catch (error: any) {
    throw new Error('Error submitting product data: ' + error.message);
  }
};
