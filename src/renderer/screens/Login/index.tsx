// src/components/LoginScreen.tsx
// SECURE VERSION - Uses contextBridge, preload script, and Axios

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './LoginScreen.css';

// TypeScript interfaces
interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  systemName: string;
}

interface FormData {
  registrationNumber: string;
  email: string;
  password: string;
}

interface CompanyDetails {
  CompanyName?: string;
}

interface Company {
  details?: CompanyDetails[];
}

interface LoginResult {
  Result?: Array<any>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

type FieldName = keyof FormData;
type Language = 'en' | 'ar';

// Electron API interface (defined by preload script)
interface ElectronAPI {
  getDeviceInfo: () => Promise<DeviceInfo>;
  userLogin: (credentials: any) => Promise<LoginResult>;
  showErrorDialog: (title: string, message: string) => void;
  showMessageDialog: (options: any) => Promise<{ response: number }>;
}

// Declare window.electronAPI
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

// Axios instance configuration
const apiClient = axios.create({
  // Base URL will be set based on environment
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'http://74.208.235.72:1001/SelfCheckOutAPI' 
    : 'http://74.208.235.72:1001/SelfCheckOutAPI',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add device info to all requests
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId) {
      config.headers['X-Device-ID'] = deviceId;
    }
console.log("deviceId",deviceId);

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error);

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection and try again.');
    }

    if (!error.response) {
      throw new Error('Network error. Please check your internet connection.');
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        throw new Error(data?.message || 'Invalid credentials. Please try again.');
      case 403:
        throw new Error(data?.message || 'Access denied. Please contact support.');
      case 404:
        throw new Error(data?.message || 'Service not found.');
      case 429:
        throw new Error('Too many requests. Please wait a moment and try again.');
      case 500:
        throw new Error(data?.message || 'Server error. Please try again later.');
      case 502:
        throw new Error('Service temporarily unavailable. Please try again later.');
      case 503:
        throw new Error('Service maintenance in progress. Please try again later.');
      default:
        throw new Error(data?.message || `Unexpected error: ${status}`);
    }
  }
);

export default function LoginScreen(): JSX.Element {
  // Refs
  const fadeAnim = useRef<number>(0);
  const slideAnim = useRef<number>(30);
  const buttonScale = useRef<number>(1);
  const inputAnimations = useRef({
    registrationNumber: 0,
    email: 0,
    password: 0,
  });

  // State
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    deviceId: '',
    deviceName: '',
    systemName: ''
  });

  const [formData, setFormData] = useState<FormData>({
    registrationNumber: '',
    email: '',
    password: '',
  });

  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [company, setCompany] = useState<Company>({});
  const [language, setLanguage] = useState<Language>('en');

  // Effects
  useEffect(() => {
    // Get device info from main process
    if (window.electronAPI) {
      window.electronAPI.getDeviceInfo()
        .then((info: DeviceInfo) => {
          setDeviceInfo(info);
          // Store device ID for API requests
          localStorage.setItem('deviceId', info.deviceId);
        })
        .catch((error: Error) => {
          console.error('Failed to get device info:', error);
        });
    }

    // Check for existing auth token
    const existingToken = localStorage.getItem('authToken');
    if (existingToken) {
      // Optional: Validate token and auto-redirect if valid
      validateToken(existingToken);
    }

    // Initial animations
    fadeAnim.current = 1;
    slideAnim.current = 0;
  }, []);

  // Token validation function
  const validateToken = useCallback(async (token: string) => {
    try {
      // You can implement token validation here
      // For example, make a request to validate the token
      console.log('Validating existing token...');
      // If valid, you might want to redirect automatically
      // window.location.href = '/home';
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('authToken');
      localStorage.removeItem('userDetails');
    }
  }, []);

  // API service functions
  const authService = {
    login: async (credentials: FormData): Promise<ApiResponse<LoginResult>> => {
      const response = await apiClient.post<LoginResult>('/auth/login', {
        registrationNumber: credentials.registrationNumber,
        email: credentials.email,
        password: credentials.password,
        deviceInfo: deviceInfo
      });
      return response;
    },

    forgotPassword: async (email: string): Promise<ApiResponse<any>> => {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response;
    },

    validateRegistration: async (registrationNumber: string): Promise<ApiResponse<any>> => {
      const response = await apiClient.get(`/auth/validate-registration/${registrationNumber}`);
      return response;
    }
  };

  // Handlers
  const updateFormData = useCallback((field: FieldName, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleInputFocus = useCallback((field: FieldName) => {
    setFocusedField(field);
    inputAnimations.current[field] = 1;
  }, []);

  const handleInputBlur = useCallback((field: FieldName) => {
    setFocusedField(null);
    inputAnimations.current[field] = 0;
  }, []);

  const handleButtonPressIn = useCallback(() => {
    buttonScale.current = 0.95;
  }, []);

  const handleButtonPressOut = useCallback(() => {
    buttonScale.current = 1;
  }, []);

  const showDeviceConflictAlert = useCallback(() => {
    if (window.electronAPI) {
      window.electronAPI.showMessageDialog({
        type: 'warning',
        title: 'Login Conflict',
        message: 'You are already logged in on another device. Please log out from the other device first or contact support if you need assistance.',
        buttons: ['Try Again', 'Contact Support']
      }).then((result) => {
        if (result.response === 0) {
          setFormData({ registrationNumber: '', email: '', password: '' });
        }
      }).catch((error: Error) => {
        console.error('Dialog error:', error);
      });
    }
  }, []);

  const handleLogin = useCallback(async () => {
    const { registrationNumber, email, password } = formData;
    
    // Validation
    if (!registrationNumber || !email || !password) {
      const errorMessage = !registrationNumber 
        ? 'Registration Number is required' 
        : !email 
        ? 'Email is required' 
        : 'Password is required';
      
      if (window.electronAPI) {
        window.electronAPI.showErrorDialog('Error', errorMessage);
      } else {
        alert(errorMessage);
      }
      return;
    }

    setIsLoading(true);
    
    try {
      // Using Axios for API call
      const response = await authService.login(formData);
      const data = response.data;

      if (data?.Result && data.Result.length > 0) {
        const userDetails = data.Result[0];
        
        // Store auth token if provided
        if (userDetails.token) {
          localStorage.setItem('authToken', userDetails.token);
        }
        
        // Store user details
        localStorage.setItem('userDetails', JSON.stringify(userDetails));
        
        console.log('Login successful:', userDetails);
        
        // Navigate to home page
        window.location.href = '/home';
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const error = err as Error;
      if (window.electronAPI) {
        window.electronAPI.showErrorDialog('Login Error', error.message || 'Something went wrong. Please try again.');
      } else {
        alert(error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, deviceInfo]);

  const handleForgotPassword = useCallback(async () => {
    const { email } = formData;
    
    if (!email) {
      if (window.electronAPI) {
        window.electronAPI.showErrorDialog('Error', 'Please enter your email address to reset your password.');
      } else {
        alert('Please enter your email address to reset your password.');
      }
      return;
    }

    try {
      setIsLoading(true);
      await authService.forgotPassword(email);
      
      if (window.electronAPI) {
        window.electronAPI.showMessageDialog({
          type: 'info',
          title: 'Password Reset',
          message: 'If an account exists with this email, you will receive password reset instructions shortly.',
          buttons: ['OK']
        });
      } else {
        alert('If an account exists with this email, you will receive password reset instructions shortly.');
      }
    } catch (err) {
      const error = err as Error;
      if (window.electronAPI) {
        window.electronAPI.showErrorDialog('Error', error.message);
      } else {
        alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData.email]);

  const handleCreateAccount = useCallback(() => {
    // Navigate to registration page or show registration dialog
    console.log('Navigate to registration page');
    // window.location.href = '/register';
  }, []);

  const switchLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // You can also update Axios headers for language
    apiClient.defaults.headers.common['Accept-Language'] = lang;
  }, []);

  const renderInput = useCallback(
    (
      field: FieldName, 
      placeholder: string, 
      iconSvg: string, 
      inputType: 'text' | 'email' | 'password' = 'text'
    ): JSX.Element => {
      const isFocused = focusedField === field;
      
      return (
        <div className="form-group" key={field}>
          <label className="field-label">{placeholder}</label>
          <div 
            className={`input-container ${isFocused ? 'input-focused' : ''}`}
            style={{
              transform: isFocused ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.2s ease'
            }}
          >
            <div className="input-icon" dangerouslySetInnerHTML={{ __html: iconSvg }} />
            <input
              type={inputType}
              placeholder={placeholder}
              className="input-field"
              value={formData[field]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData(field, e.target.value)}
              onFocus={() => handleInputFocus(field)}
              onBlur={() => handleInputBlur(field)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && field === 'password') {
                  handleLogin();
                }
              }}
              autoComplete={field === 'password' ? 'current-password' : field === 'email' ? 'username' : 'off'}
            />
          </div>
        </div>
      );
    },
    [formData, focusedField, updateFormData, handleInputFocus, handleInputBlur, handleLogin],
  );

  // SVG icons (same as before)
  const backIcon = `<svg width="24" height="24" fill="#fdfcfc" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>`;
  const helpIcon = `<svg width="22" height="22" fill="#fdfcfc" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/></svg>`;
  const loginIcon = `<svg width="32" height="32" fill="#fdfcfc" viewBox="0 0 256 256"><path d="M141.66,133.66l-40,40a8,8,0,0,1-11.32-11.32L116.69,136H24a8,8,0,0,1,0-16h92.69L90.34,93.66a8,8,0,0,1,11.32-11.32l40,40A8,8,0,0,1,141.66,133.66ZM192,32H136a8,8,0,0,0,0,16h56V208H136a8,8,0,0,0,0,16h56a16,16,0,0,0,16-16V48A16,16,0,0,0,192,32Z"/></svg>`;
  const userIcon = `<svg width="24" height="24" fill="#fdfcfc" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"/></svg>`;
  const documentIcon = `<svg width="20" height="20" fill="#4a2d23" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V88H40ZM40,200V104H216v96Z"/></svg>`;
  const emailIcon = `<svg width="20" height="20" fill="#4a2d23" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a8,8,0,0,0,8,8H224a8,8,0,0,0,8-8V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM40,180V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V180Z"/></svg>`;
  const lockIcon = `<svg width="20" height="20" fill="#4a2d23" viewBox="0 0 256 256"><path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"/></svg>`;
  const arrowIcon = `<svg width="20" height="20" fill="#fdfcfc" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg>`;
  const securityIcon = `<svg width="16" height="16" fill="#4a2d23" viewBox="0 0 256 256"><path d="M208,40H48A16,16,0,0,0,32,56V200a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40ZM48,56H208V88H48ZM48,200V104H208v96Z"/></svg>`;

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="gradient-overlay" />
        <div className="top-row">
          <button 
            className="back-button" 
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <div dangerouslySetInnerHTML={{ __html: backIcon }} />
          </button>
          <button className="help-button" aria-label="Help">
            <div dangerouslySetInnerHTML={{ __html: helpIcon }} />
          </button>
        </div>

        <div className="header-content">
          <div className="icon-title-row">
            <div className="login-icon-container">
              <div dangerouslySetInnerHTML={{ __html: loginIcon }} />
            </div>
            <div className="title-container">
              <h1 className="main-title">Welcome Back</h1>
              <p className="subtitle">Sign in to continue your culinary journey</p>
            </div>
          </div>
        </div>

        <div className="decorative-elements">
          <div className="decorative-circle1" />
          <div className="decorative-circle2" />
        </div>
      </header>

      <div className="main-content">
        {/* Hero Image */}
        <div className="image-container">
          <img
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
            className="header-image"
            alt="Restaurant interior"
          />
          <div className="image-overlay">
            <div className="brand-container">
              <div className="brand-icon">
                <div dangerouslySetInnerHTML={{ __html: userIcon }} />
              </div>
              <span className="brand-text">
                {company?.details?.[0]?.CompanyName || 'Restaurant Name'}
              </span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">Sign In</h2>
            <p className="form-subtitle">Enter your credentials to access your account</p>
          </div>

          <div className="form-content">
            {renderInput('registrationNumber', 'Registration Number', documentIcon, 'text')}
            {renderInput('email', 'User Name', emailIcon, 'email')}
            {renderInput('password', 'Password', lockIcon, 'password')}

            {/* Login Button */}
            <div style={{ transform: `scale(${buttonScale.current})` }}>
              <button
                className={`login-button ${isLoading ? 'login-button-loading' : ''}`}
                onClick={handleLogin}
                onMouseDown={handleButtonPressIn}
                onMouseUp={handleButtonPressOut}
                onMouseLeave={handleButtonPressOut}
                disabled={isLoading}
                aria-label="Sign in"
              >
                {isLoading ? (
                  <div className="loading-container">
                    <div className="spinner" />
                    <span className="login-button-text">Signing In...</span>
                  </div>
                ) : (
                  <>
                    <span className="login-button-text">Sign In</span>
                    <div 
                      className="button-icon" 
                      dangerouslySetInnerHTML={{ __html: arrowIcon }} 
                    />
                  </>
                )}
              </button>
            </div>

            {/* Links */}
            <div className="links-container">
              <button 
                className="link-button" 
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Forgot Password?
              </button>
              <button 
                className="link-button" 
                onClick={handleCreateAccount}
                disabled={isLoading}
              >
                Create New Account
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <div className="security-icon" dangerouslySetInnerHTML={{ __html: securityIcon }} />
          <span className="security-text">Your information is secure and encrypted</span>
        </div>

        {/* Language Selection */}
        <div className="language-section">
          <div className="language-buttons">
            <button
              className={`lang-button ${language === 'en' ? 'active-lang' : ''}`}
              onClick={() => switchLanguage('en')}
              aria-label="Switch to English"
            >
              <span className="flag-emoji" role="img" aria-label="US flag">🇺🇸</span>
              <span className={language === 'en' ? 'active-lang-text' : 'lang-text'}>
                English
              </span>
            </button>
            <button
              className={`lang-button ${language === 'ar' ? 'active-lang' : ''}`}
              onClick={() => switchLanguage('ar')}
              aria-label="Switch to Arabic"
            >
              <span className="flag-emoji" role="img" aria-label="Saudi flag">🇸🇦</span>
              <span className={language === 'ar' ? 'active-lang-text' : 'lang-text'}>
                العربية
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}