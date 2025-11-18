class ApiResponse {
  static success(res, statusCode = 200, message = 'Success', data = null, meta = {}) {
    const response = {
      success: true,
      message,
      ...(data !== null && { data }),
      ...meta
    };

    return res.status(statusCode).json(response);
  }

  static error(res, statusCode = 500, message = 'Internal Server Error', errors = null) {
    const response = {
      success: false,
      message,
      ...(errors && { errors })
    };

    return res.status(statusCode).json(response);
  }

  static paginated(res, statusCode = 200, message = 'Success', data = [], pagination = {}) {
    const { page, limit, total } = pagination;
    
    const response = {
      success: true,
      message,
      data,
      pagination: {
        page: page || 1,
        limit: limit || 10,
        total: total || 0,
        pages: Math.ceil((total || 0) / (limit || 10)),
        count: data.length
      }
    };

    return res.status(statusCode).json(response);
  }

  static created(res, message = 'Resource created successfully', data = null) {
    return ApiResponse.success(res, 201, message, data);
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static badRequest(res, message = 'Bad Request', errors = null) {
    return ApiResponse.error(res, 400, message, errors);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return ApiResponse.error(res, 401, message);
  }

  static forbidden(res, message = 'Forbidden') {
    return ApiResponse.error(res, 403, message);
  }

  static notFound(res, message = 'Resource not found') {
    return ApiResponse.error(res, 404, message);
  }

  static serverError(res, message = 'Internal Server Error', errors = null) {
    return ApiResponse.error(res, 500, message, errors);
  }
}

module.exports = ApiResponse;

