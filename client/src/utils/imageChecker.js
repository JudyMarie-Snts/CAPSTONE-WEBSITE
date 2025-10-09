// Utility to check if images exist and provide fallbacks
export const checkImageExists = (imagePath) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
};

// Fallback image URLs for missing assets
export const fallbackImages = {
  food: '/src/assets/1.jpg', // Generic food image
  background: '/src/assets/bg.jpg', // Generic background
  logo: '/src/assets/websitelogo.jpg', // Logo fallback
  reservation: '/src/assets/reservation.jpg' // Reservation background
};

// Get image with fallback
export const getImageWithFallback = async (primaryImage, fallbackType = 'food') => {
  const exists = await checkImageExists(primaryImage);
  return exists ? primaryImage : fallbackImages[fallbackType];
};

// Preload critical images
export const preloadImages = (imageList) => {
  imageList.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};
