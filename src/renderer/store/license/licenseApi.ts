// src/features/license/licenseAPI.js
import api from '../../app/api/api';
import { ENDPOINTS } from '../../app/api/apiEndPoint';
import { useAppSelector } from '../../hooks/hooks';
const user = useAppSelector((state:any) => state.auth?.user);


const licenseData =  [
  {
      "Param": "Select",
      "LicenceDetail": {
          "Trans_Id": "9",
          "RegistrationNo":user?.formData?.registrationNumber?user?.formData?.registrationNumber:"",
          "att_device_count": "",
          "company_name": "1",
          "country_id": "1",
          "database": "",
          "db_password": "",
          "email": "",
          "es_database": "",
          "expiry_date": "",
          "hostname": "",
          "license_key": "",
          "no_of_employee": "",
          "password": "",
          "phone": "",
          "port": "",
          "product_code": "",
          "registration_code": "",
          "user": "",
          "username": "",
          "version_type":"",
          "Field1":"",
          "Field2":"",
          "Field3":"",
          "Field4":"",
          "Field5":"",
          "Field6":"True",
          "Field7":"2025-01-14 17:54:48",
          "IsActive":"True",
          "CreatedBy":"",
          "CreatedDate":"2025-01-14 17:54:48",
          "ModifiedBy":"",
          "ModifiedDate":"2025-01-14 17:54:48"
      }
  }
]

// Function to send x-www-form-urlencoded data in a POST request
export const submitLicenseData = async (data: any) => {
  try {
    // Serialize the data into x-www-form-urlencoded format using qs
    // const formData = qs.stringify(licenseData);
    
    // Make the POST request
    const response = await api.post(ENDPOINTS.GET_LICENSEDATA, licenseData, {
      headers: {
        'Content-Type': 'application/json',  // Set content type
      },
    });

    return response.data;  // Return the API response
  } catch (error:any) {
    throw new Error('Error submitting license data: ' + error.message);
  }
};
