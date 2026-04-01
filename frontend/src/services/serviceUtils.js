export const getErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || fallbackMessage;

export const createServiceError = (error, fallbackMessage) => {
  const serviceError = new Error(getErrorMessage(error, fallbackMessage));
  serviceError.status = error.response?.status;
  serviceError.payload = error.response?.data;
  serviceError.cause = error;
  return serviceError;
};
