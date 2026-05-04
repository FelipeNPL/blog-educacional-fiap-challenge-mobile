export const getErrorMessage = (error: any, defaultMessage: string = "An error occurred"): string => {
  if (error?.response?.data?.message) {
    const message = error.response.data.message;
    if (Array.isArray(message)) {
      return message.join("\n");
    }
    return message;
  }
  return error.message || defaultMessage;
};
