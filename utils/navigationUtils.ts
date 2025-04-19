/**
 * Navigation utility functions for cross-page data sharing
 */

/**
 * Store data in sessionStorage for cross-page access
 */
export const storePageData = (key: string, data: any): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing ${key} data:`, error);
  }
};

/**
 * Retrieve data from sessionStorage
 */
export const getPageData = <T>(key: string): T | null => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error retrieving ${key} data:`, error);
    return null;
  }
};

/**
 * Clear specific data from sessionStorage
 */
export const clearPageData = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing ${key} data:`, error);
  }
};

/**
 * Create and dispatch a custom event
 */
export const dispatchCustomEvent = (eventName: string, detail: any): void => {
  try {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  } catch (error) {
    console.error(`Error dispatching ${eventName} event:`, error);
  }
};

/**
 * Preload data for a page
 */
export const preloadPageData = (dataKey: string, data: any, redirectUrl: string): void => {
  storePageData(dataKey, data);
  window.location.href = redirectUrl;
};
