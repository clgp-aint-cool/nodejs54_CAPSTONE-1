export const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    status: 'success',
    message
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    status: 'error',
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};
