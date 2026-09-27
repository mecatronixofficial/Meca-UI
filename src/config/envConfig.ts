// ================================
// 🔹 Helper Functions
// ================================

// Safe boolean parser
const envBool = (key: string, fallback = false) =>
  process.env[key]?.toLowerCase() === 'true' || fallback;

// Safe numeric parser
const envNum = (key: string, fallback = 0) => {
  const value = Number(process.env[key]);
  return Number.isFinite(value) ? value : fallback;
};

// Detect production mode
const isProd = process.env.NODE_ENV === 'production';

// ================================
// 🔹 Main Config
// ================================
export const mecatronixConfig = Object.freeze({
  // Application
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Mecatronix',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Industrial Automation & Control Systems',
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Mecatronix',
    slogan: process.env.NEXT_PUBLIC_APP_SLOGAN || 'Engineering the Future of Automation',
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
  },

  // API
  api: {
    baseUrl: isProd
      ? (process.env.NEXT_PUBLIC_API_BASE_URL?.replace('http://', 'https://') || 'https://localhost:5000/mec-api')
      : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/mec-api',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000',
    timeout: envNum('NEXT_PUBLIC_API_TIMEOUT', 30000),
  },

  // Industrial Features
  industrial: {
    refreshRate: envNum('NEXT_PUBLIC_DEFAULT_REFRESH_RATE', 1000),
    maxMachines: envNum('NEXT_PUBLIC_MAX_CONCURRENT_MACHINES', 50),
    pollingInterval: envNum('NEXT_PUBLIC_MACHINE_STATUS_POLLING', 5000),
  },

  // Features
  features: {
    realTimeMonitoring: envBool('NEXT_PUBLIC_ENABLE_REAL_TIME_MONITORING'),
    machineControls: envBool('NEXT_PUBLIC_ENABLE_MACHINE_CONTROLS'),
    analytics: envBool('NEXT_PUBLIC_ENABLE_DATA_ANALYTICS'),
  },

  // Debug
  debug: {
    enabled: envBool('NEXT_PUBLIC_DEBUG_MODE'),
    mockData: envBool('NEXT_PUBLIC_ENABLE_MOCK_DATA'),
  },

  // Contact Information
  contact: {
    companyEmail: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'connect@mecatronix.one',
    supportEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'mecatronixofficial@gmail.com',
    primaryPhone: process.env.NEXT_PUBLIC_PRIMARY_PHONE || '+918300454800',
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+918300454800',
  },

  // Social Media
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/profile.php?id=61586332485916',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/mecatronixofficial/',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL,
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://www.youtube.com/@Mecatronixsoftwaredevelopment',
    github: process.env.NEXT_PUBLIC_GITHUB_URL,
  },

  // Company Location
  location: {
    fullAddress: process.env.NEXT_PUBLIC_COMPANY_FULL_ADDRESS || "No.3/12, Old ESI St, Sivasakthi Colony, Ganapathy, Coimbatore, Tamil Nadu 641006",
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'No.3/12, Old ESI St, Sivasakthi Colony, Ganapathy,',
    city: process.env.NEXT_PUBLIC_COMPANY_CITY || 'Coimbatore',
    state: process.env.NEXT_PUBLIC_COMPANY_STATE || 'Tamil Nadu',
    country: process.env.NEXT_PUBLIC_COMPANY_COUNTRY || 'India',
    pincode: process.env.NEXT_PUBLIC_COMPANY_PINCODE || '641006',
    googleMapsLink: process.env.NEXT_PUBLIC_GOOGLE_MAPS_LINK || 'https://maps.app.goo.gl/yoaoHinWEJ3pqrQv8',
  },

  // Business Hours
  business: {
    hoursStart: process.env.NEXT_PUBLIC_BUSINESS_HOURS_START || '10:00',
    hoursEnd: process.env.NEXT_PUBLIC_BUSINESS_HOURS_END || '19:00',
    days: process.env.NEXT_PUBLIC_BUSINESS_DAYS || 'Mon-Sat',
    emergencySupport24x7: envBool('NEXT_PUBLIC_EMERGENCY_SUPPORT_24x7'),
  },

  // Localization
  localization: {
    defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    supportedLanguages: (process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES || 'en,hi,ta').split(','),
    timezone: process.env.NEXT_PUBLIC_TIMEZONE || 'Asia/Kolkata',
    currency: process.env.NEXT_PUBLIC_CURRENCY || 'INR',
    dateFormat: process.env.NEXT_PUBLIC_DATE_FORMAT || 'DD/MM/YYYY',
  }
});

// ================================
// 🔹 Environment Validation
// ================================
export const validateEnvironment = () => {
  const required = [
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_COMPANY_EMAIL',
    'NEXT_PUBLIC_PRIMARY_PHONE',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    return false;
  }

  return true;
};

// Default export for convenience
export default mecatronixConfig;
