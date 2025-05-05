/**
 * Utility function to clear all local storage and cookies related to the application
 */

export const clearAllStorage = () => {
  // Clear all localStorage
  localStorage.clear();
  
  // Clear all cookies
  document.cookie.split(';').forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
  
  console.log('All local storage and cookies have been cleared.');
};
