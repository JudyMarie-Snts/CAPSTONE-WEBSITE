// Image loader utility to ensure all assets load correctly
// This helps with Vite's asset handling

/**
 * Get image URL from assets folder
 * @param {string} imageName - Name of the image file (e.g., 'bg.jpg')
 * @returns {string} - Image URL
 */
export function getImageUrl(imageName) {
  return new URL(`../assets/${imageName}`, import.meta.url).href
}

/**
 * Preload images to ensure they're cached
 * @param {string[]} imageNames - Array of image file names
 */
export function preloadImages(imageNames) {
  imageNames.forEach(imageName => {
    const img = new Image()
    img.src = getImageUrl(imageName)
  })
}

// Export all asset paths for easy access
export const ASSETS = {
  // Background images
  BG: new URL('../assets/bg.jpg', import.meta.url).href,
  BG2: new URL('../assets/bg2.png', import.meta.url).href,
  HERO: new URL('../assets/hero.jpg', import.meta.url).href,
  RESERVATION: new URL('../assets/reservation.jpg', import.meta.url).href,
  FEEDBACK: new URL('../assets/feedback.jpg', import.meta.url).href,
  FEEDBACK2: new URL('../assets/feedback2.jpg', import.meta.url).href,
  
  // Logo
  WEBSITE_LOGO: new URL('../assets/websitelogo2.jpg', import.meta.url).href,
  BLACK_LOGO: new URL('../assets/blacklogo.jpg', import.meta.url).href,
  
  // Gallery images
  GALLERY_1: new URL('../assets/1.jpg', import.meta.url).href,
  GALLERY_2: new URL('../assets/2.jpg', import.meta.url).href,
  GALLERY_3: new URL('../assets/3.jpg', import.meta.url).href,
  GALLERY_4: new URL('../assets/4.jpg', import.meta.url).href,
  GALLERY_5: new URL('../assets/5.jpg', import.meta.url).href,
  GALLERY_6: new URL('../assets/6.jpg', import.meta.url).href,
  GALLERY_7: new URL('../assets/7.jpg', import.meta.url).href,
  GALLERY_8: new URL('../assets/8.jpg', import.meta.url).href,
  GALLERY_9: new URL('../assets/9.jpg', import.meta.url).href,
  GALLERY_10: new URL('../assets/10.jpg', import.meta.url).href,
  GALLERY_11: new URL('../assets/11.jpg', import.meta.url).href,
  GALLERY_12: new URL('../assets/12.jpg', import.meta.url).href,
  GALLERY_13: new URL('../assets/13.jpg', import.meta.url).href,
  GALLERY_14: new URL('../assets/14.jpg', import.meta.url).href,
  GALLERY_15: new URL('../assets/15.png', import.meta.url).href,
  
  // Food items
  SIOMAI: new URL('../assets/Siomai.png', import.meta.url).href,
  SAUSAGE: new URL('../assets/Sausage.png', import.meta.url).href,
  CUCUMBER: new URL('../assets/Cucumber.png', import.meta.url).href,
  BEAN_SPROUTS: new URL('../assets/Bean Sprouts.png', import.meta.url).href,
  KIMCHI: new URL('../assets/Kimchi.png', import.meta.url).href,
  FISHCAKE: new URL('../assets/Fishcake.png', import.meta.url).href,
  EGGROLL: new URL('../assets/Eggroll.png', import.meta.url).href,
  BABY_POTATOES: new URL('../assets/Baby Potatoes.png', import.meta.url).href,
  PORK: new URL('../assets/Pork.png', import.meta.url).href,
  BEEF: new URL('../assets/Beef.png', import.meta.url).href,
  CHICKEN: new URL('../assets/Chicken.png', import.meta.url).href,
  PREMIUM_PORK: new URL('../assets/Premium Pork.png', import.meta.url).href,
  PREMIUM_CHICKEN: new URL('../assets/Premium Chicken.png', import.meta.url).href,
  RICE: new URL('../assets/Rice.png', import.meta.url).href,
  LETTUCE: new URL('../assets/Lettuce.png', import.meta.url).href,
  CHEESE: new URL('../assets/Cheese.png', import.meta.url).href,
  DRINKS: new URL('../assets/Drinks.png', import.meta.url).href,
  
  // Menu items
  CHICKEN_POPPERS: new URL('../assets/CHICKEN POPPERS.JPG', import.meta.url).href,
  SAMG_PORK: new URL('../assets/SAMG PORK ON CUP.jpg', import.meta.url).href,
  SET_A: new URL('../assets/SET A UNLIMITED PORK.jpg', import.meta.url).href,
  
  // Other
  GCASH: new URL('../assets/gcash.png', import.meta.url).href,
  BDAY: new URL('../assets/bday.jpg', import.meta.url).href,
  KOREA: new URL('../assets/korea.jpg', import.meta.url).href,
  SIDE1: new URL('../assets/side1.jpg', import.meta.url).href,
  SIDE2: new URL('../assets/side2.jpg', import.meta.url).href,
}

export default ASSETS
