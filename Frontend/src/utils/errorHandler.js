// Centralized error message extraction from Axios errors
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with a status code outside of 2xx
    const { status, data } = error.response;

    // Handle ASP.NET Core validation errors (ProblemDetails format)
    if (data && data.errors) {
      const messages = Object.values(data.errors).flat();
      return messages.join(', ');
    }

    // Handle ASP.NET Core ProblemDetails title/message
    if (data && data.title) {
      return data.title;
    }

    if (data && data.message) {
      return data.message;
    }

    // Handle common HTTP status codes
    switch (status) {
      case 400:
        return 'Bad request. Please check your input and try again.';
      case 401:
        return 'Unauthorized. Please log in to continue.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found. It may have been deleted.';
      case 409:
        return 'Conflict. The resource already exists.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return `Request failed with status code ${status}.`;
    }
  }

  if (error.request) {
    // Request was made but no response received (network/CORS issue)
    return 'Unable to reach the server. Please check your connection and ensure the backend is running.';
  }

  // Something happened in setting up the request
  return error.message || 'An unexpected error occurred. Please try again.';
};