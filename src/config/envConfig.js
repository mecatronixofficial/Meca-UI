// ================================
// 🔹 Helper Functions
// ================================

// Safe boolean parser
const envBool = (key, fallback = false) =>
  import.meta.env[key]?.toLowerCase() === 'true' || fallback;

// Safe numeric parser
const envNum = (key, fallback = 0) => {
  const value = Number(import.meta.env[key]);
  return Number.isFinite(value) ? value : fallback;
};

// Detect production mode
const isProd = import.meta.env.PROD;

// ================================
// 🔹 Main Config
// ================================
export const mecatronixConfig = Object.freeze({
  // Application
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Mecatronix',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Industrial Automation & Control Systems',
    companyName: import.meta.env.VITE_COMPANY_NAME || 'Mecatronix',
    slogan: import.meta.env.VITE_APP_SLOGAN || 'Engineering the Future of Automation',
    environment: import.meta.env.VITE_ENVIRONMENT || 'production',
  },

  // API
  api: {
    baseUrl: isProd
      ? (import.meta.env.VITE_API_BASE_URL?.replace('http://', 'https://') || 'https://localhost:5000/mec-api')
      : import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/mec-api',
    wsUrl: import.meta.env.VITE_WS_URL || 'http://localhost:5000',
    timeout: envNum('VITE_API_TIMEOUT', 30000),
  },

  // Industrial Features
  industrial: {
    refreshRate: envNum('VITE_DEFAULT_REFRESH_RATE', 1000),
    maxMachines: envNum('VITE_MAX_CONCURRENT_MACHINES', 50),
    pollingInterval: envNum('VITE_MACHINE_STATUS_POLLING', 5000),
  },

  // Features
  features: {
    realTimeMonitoring: envBool('VITE_ENABLE_REAL_TIME_MONITORING'),
    machineControls: envBool('VITE_ENABLE_MACHINE_CONTROLS'),
    analytics: envBool('VITE_ENABLE_DATA_ANALYTICS'),
  },

  // Debug
  debug: {
    enabled: envBool('VITE_DEBUG_MODE'),
    mockData: envBool('VITE_ENABLE_MOCK_DATA'),
  },

  // Contact Information
  contact: {
    companyEmail: import.meta.env.VITE_COMPANY_EMAIL || 'connect@mecatronix.one',
    supportEmail: import.meta.env.VITE_CONTACT_EMAIL || 'mecatronixofficial@gmail.com',
    primaryPhone: import.meta.env.VITE_PRIMARY_PHONE || '+918300454800',
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '+918300454800',
  },

  // Social Media
  social: {
    facebook: import.meta.env.VITE_FACEBOOK_URL,
    instagram: import.meta.env.VITE_INSTAGRAM_URL,
    linkedin: import.meta.env.VITE_LINKEDIN_URL,
    twitter: import.meta.env.VITE_TWITTER_URL,
    youtube: import.meta.env.VITE_YOUTUBE_URL,
    github: import.meta.env.VITE_GITHUB_URL,
  },

  // Company Location
  location: {
    fullAddress: import.meta.env.VITE_COMPANY_FULL_ADDRESS || "No.3/12, Old ESI St, Sivasakthi Colony, Ganapathy, Coimbatore, Tamil Nadu 641006",
    address: import.meta.env.VITE_COMPANY_ADDRESS || 'No.3/12, Old ESI St, Sivasakthi Colony, Ganapathy,',
    city: import.meta.env.VITE_COMPANY_CITY || 'Coimbatore',
    state: import.meta.env.VITE_COMPANY_STATE || 'Tamil Nadu',
    country: import.meta.env.VITE_COMPANY_COUNTRY || 'India',
    pincode: import.meta.env.VITE_COMPANY_PINCODE || '641006',
    googleMapsLink: import.meta.env.VITE_GOOGLE_MAPS_LINK || 'https://maps.app.goo.gl/yoaoHinWEJ3pqrQv8',
  },

  // Business Hours
  business: {
    hoursStart: import.meta.env.VITE_BUSINESS_HOURS_START || '10:00',
    hoursEnd: import.meta.env.VITE_BUSINESS_HOURS_END || '19:00',
    days: import.meta.env.VITE_BUSINESS_DAYS || 'Mon-Sat',
    emergencySupport24x7: envBool('VITE_EMERGENCY_SUPPORT_24x7'),
  },

  // Localization
  localization: {
    defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
    supportedLanguages: (import.meta.env.VITE_SUPPORTED_LANGUAGES || 'en,hi,ta').split(','),
    timezone: import.meta.env.VITE_TIMEZONE || 'Asia/Kolkata',
    currency: import.meta.env.VITE_CURRENCY || 'INR',
    dateFormat: import.meta.env.VITE_DATE_FORMAT || 'DD/MM/YYYY',
  }
});

// ================================
// 🔹 Environment Validation
// ================================
export const validateEnvironment = () => {
  const required = [
    'VITE_APP_NAME',
    'VITE_API_BASE_URL',
    'VITE_COMPANY_EMAIL',
    'VITE_PRIMARY_PHONE',
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    return false;
  }

  return true;
};

// Default export for convenience
export default mecatronixConfig;
