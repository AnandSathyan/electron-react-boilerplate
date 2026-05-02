// src/features/modifierProduct/modifierProductApi.js
import api from '../../../app/api/api';
import { ENDPOINTS } from '../../../app/api/apiEndPoint';
import qs from 'qs';

export const submitmodifierProductData = async ({ registrationNumber, companyId, BrandId }:any) => {
  
  const modifierProductData = {
    RegistrationNo: registrationNumber || '',
    Pass: 'Admin',
    CompanyID: companyId,
    BrandID: BrandId,
    IsModifire:true,
    Status:"Active"
  };

  try {
    const response = await api.post(
      ENDPOINTS.FETCH_PRODUCTS,
      qs.stringify(modifierProductData),
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
    throw new Error('Error submitting modifierProduct data: ' + error.message);
  }
};
