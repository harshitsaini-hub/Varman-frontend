/**
 * Varman Error Handling Utility
 *
 * Extracts a user-facing error string from any error object, API response, or string.
 * GUARANTEE: ALWAYS returns a primitive string. Never returns an object, array, null, or undefined.
 * This prevents React runtime crash #31 ("Objects are not valid as a React child").
 *
 * @param {any} error - The error object (AxiosError, Error, string, object, etc.)
 * @param {string} [fallback='An unexpected error occurred. Please try again.']
 * @returns {string} Safe human-readable error message
 */
export function getErrorMessage(error, fallback = 'An unexpected error occurred. Please try again.') {
  if (!error) {
    return fallback;
  }

  // If already a non-empty string
  if (typeof error === 'string') {
    const trimmed = error.trim();
    return trimmed || fallback;
  }

  // 1. Check Axios response data structure
  const responseData = error.response?.data;
  if (responseData) {
    // 1a. String response body
    if (typeof responseData === 'string') {
      const trimmed = responseData.trim();
      return trimmed || fallback;
    }

    // 1b. detail field
    if (responseData.detail) {
      if (typeof responseData.detail === 'string') {
        const trimmed = responseData.detail.trim();
        return trimmed || fallback;
      }
      // If detail is an array (FastAPI default validation errors: [{loc, msg, type}, ...])
      if (Array.isArray(responseData.detail)) {
        const messages = responseData.detail
          .map((item) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') {
              const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : null;
              const msg = item.msg || item.message || '';
              return field && field !== 'body' ? `${field}: ${msg}` : msg;
            }
            return '';
          })
          .filter(Boolean);
        if (messages.length > 0) {
          return messages.join('; ');
        }
      }
      // If detail is an object
      if (typeof responseData.detail === 'object') {
        return responseData.detail.message || responseData.detail.msg || JSON.stringify(responseData.detail);
      }
    }

    // 1c. errors list (custom validation error format: [{field, message}, ...])
    if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
      const messages = responseData.errors
        .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
        .filter(Boolean);
      if (messages.length > 0) {
        return messages.join('; ');
      }
    }

    // 1d. Generic message / error fields in responseData
    if (typeof responseData.message === 'string' && responseData.message.trim()) {
      return responseData.message.trim();
    }
    if (typeof responseData.error === 'string' && responseData.error.trim()) {
      return responseData.error.trim();
    }
  }

  // 2. Check network error or connection timeout
  if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
    return 'Unable to connect to the server. Please check your network connection.';
  }
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'The request timed out. Please try again.';
  }

  // 3. Standard JS Error.message
  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message.trim();
  }

  // 4. Fallback string representation
  try {
    const stringified = String(error);
    if (stringified && stringified !== '[object Object]') {
      return stringified;
    }
  } catch {
    // Ignore stringify error
  }

  return fallback;
}

export default getErrorMessage;
