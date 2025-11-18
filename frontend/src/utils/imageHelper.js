// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend backend URL
  const API_BASE = process.env.REACT_APP_API_URL.replace('/api', '');
  return `${API_BASE}${imagePath}`;
};

// Get first image URL from photos array
export const getFirstImageUrl = (photos) => {
  if (!photos || photos.length === 0) return null;
  return getImageUrl(photos[0]);
};

