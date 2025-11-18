/**
 * Cookie utility functions for storing authentication tokens
 */

/**
 * Set a cookie with the given name, value, and expiration days
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration (default: 7)
 */
export const setCookie = (name, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
};

/**
 * Remove a cookie by name
 * @param {string} name - Cookie name
 */
export const removeCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

/**
 * Set authentication token in cookie
 * @param {string} token - JWT authentication token
 * @param {number} days - Number of days until expiration (default: 7)
 */
export const setAuthToken = (token, days = 7) => {
  setCookie('authToken', token, days);
};

/**
 * Get authentication token from cookie
 * @returns {string|null} - JWT token or null if not found
 */
export const getAuthToken = () => {
  return getCookie('authToken');
};

/**
 * Remove authentication token cookie
 */
export const removeAuthToken = () => {
  removeCookie('authToken');
};

