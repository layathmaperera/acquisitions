export const formatValidationError = (error) => {
  if (!error || !error.issues) return 'Validation error';

  if (Array.isArray(error.issues)) {
    return error.issues.map(i => i.message).join(', ');
  }

  return JSON.stringify(error);
};
