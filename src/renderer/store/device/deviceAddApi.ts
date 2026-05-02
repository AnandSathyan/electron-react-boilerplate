// src/features/device/deviceAPI.js
import api from '../../app/api/api';
import { ENDPOINTS } from '../../app/api/apiEndPoint';

export const submitDeviceAddData = async ({payload}:any) => {
  const deviceData = [
    {
      "Param": "Insert",
      "DeviceDetail": {
        "RegistrationNo": payload?.registrationNumber || "",
        "Company_Id": "",
        "Brand_Id": "",
        "Location_Id": "",
        "Device_Name": payload?.deviceName,
        "Device_Name_L": "",
        "IP_Address": "",
        "Port": "",
        "Communication_Type": "",
        "Field1": "",
        "Field2": "",
        "Field3": "",
        "Field4": "",
        "Field5": "",
        "Field6": "",
        "Field7": "",
        "IsActive": "",
        "CreatedBy": "",
        "CreatedDate": "",
        "ModifiedBy": "",
        "ModifiedDate": ""
      }
    }
  ];

  try {
    const response = await api.post(ENDPOINTS.GET_DEVICE_INFO, deviceData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error:any) {
    throw new Error('Error submitting device data: ' + error.message);
  }
};
