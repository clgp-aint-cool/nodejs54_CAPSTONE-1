export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Image Gallery API',
    version: '1.0.0',
    description: 'API for Image Gallery Application with JWT Authentication'
  },
  servers: [
    {
      url: 'http://localhost:3069',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'ho_ten'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', minLength: 6, example: 'password123' },
                  ho_ten: { type: 'string', example: 'Nguyen Van A' },
                  tuoi: { type: 'integer', minimum: 1, maximum: 120, example: 25 }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    message: { type: 'string', example: 'Registration successful' },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            nguoi_dung_id: { type: 'integer' },
                            email: { type: 'string' },
                            ho_ten: { type: 'string' },
                            tuoi: { type: 'integer' },
                            anh_dai_dien: { type: 'string', nullable: true }
                          }
                        },
                        token: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: 'Validation error' },
          500: { description: 'Server error' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    message: { type: 'string', example: 'Login successful' },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            nguoi_dung_id: { type: 'integer' },
                            email: { type: 'string' },
                            ho_ten: { type: 'string' },
                            tuoi: { type: 'integer' },
                            anh_dai_dien: { type: 'string', nullable: true }
                          }
                        },
                        token: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          401: { description: 'Invalid credentials' },
          400: { description: 'Validation error' }
        }
      }
    },
    '/api/images': {
      get: {
        tags: ['Images'],
        summary: 'Get all images with optional search',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 20 }
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Search by image name or description'
          }
        ],
        responses: {
          200: {
            description: 'Images retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        images: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              hinh_id: { type: 'integer' },
                              ten_hinh: { type: 'string' },
                              duong_dan: { type: 'string' },
                              mo_ta: { type: 'string' },
                              ngay_tao: { type: 'string', format: 'date-time' },
                              nguoi_dung: {
                                type: 'object',
                                properties: {
                                  nguoi_dung_id: { type: 'integer' },
                                  ho_ten: { type: 'string' },
                                  anh_dai_dien: { type: 'string', nullable: true }
                                }
                              },
                              _count: {
                                type: 'object',
                                properties: {
                                  binh_luan: { type: 'integer' },
                                  luu_anh: { type: 'integer' }
                                }
                              }
                            }
                          }
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            page: { type: 'integer' },
                            limit: { type: 'integer' },
                            total: { type: 'integer' },
                            pages: { type: 'integer' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Images'],
        summary: 'Upload a new image',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (JPEG, PNG, GIF, WebP)'
                  },
                  ten_hinh: {
                    type: 'string',
                    description: 'Image title'
                  },
                  mo_ta: {
                    type: 'string',
                    description: 'Image description'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Image created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        image: {
                          type: 'object',
                          properties: {
                            hinh_id: { type: 'integer' },
                            nguoi_dung_id: { type: 'integer' },
                            ten_hinh: { type: 'string' },
                            duong_dan: { type: 'string' },
                            mo_ta: { type: 'string' },
                            ngay_tao: { type: 'string', format: 'date-time' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/images/{id}': {
      get: {
        tags: ['Images'],
        summary: 'Get image by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Image retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        image: {
                          type: 'object',
                          properties: {
                            hinh_id: { type: 'integer' },
                            ten_hinh: { type: 'string' },
                            duong_dan: { type: 'string' },
                            mo_ta: { type: 'string' },
                            ngay_tao: { type: 'string', format: 'date-time' },
                            nguoi_dung: {
                              type: 'object',
                              properties: {
                                nguoi_dung_id: { type: 'integer' },
                                ho_ten: { type: 'string' },
                                anh_dai_dien: { type: 'string', nullable: true }
                              }
                            },
                            binh_luan: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  binh_luan_id: { type: 'integer' },
                                  noi_dung: { type: 'string' },
                                  ngay_binh_luan: { type: 'string', format: 'date-time' },
                                  nguoi_dung: {
                                    type: 'object',
                                    properties: {
                                      nguoi_dung_id: { type: 'integer' },
                                      ho_ten: { type: 'string' },
                                      anh_dai_dien: { type: 'string', nullable: true }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: { description: 'Image not found' }
        }
      },
      delete: {
        tags: ['Images'],
        summary: 'Delete an image',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Image deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          404: { description: 'Image not found or no permission' }
        }
      }
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Get current user info',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User info retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            nguoi_dung_id: { type: 'integer' },
                            email: { type: 'string' },
                            ho_ten: { type: 'string' },
                            tuoi: { type: 'integer' },
                            anh_dai_dien: { type: 'string', nullable: true },
                            hinh_anh: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  hinh_id: { type: 'integer' },
                                  ten_hinh: { type: 'string' },
                                  duong_dan: { type: 'string' },
                                  mo_ta: { type: 'string' },
                                  ngay_tao: { type: 'string', format: 'date-time' }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Users'],
        summary: 'Update user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ho_ten: { type: 'string' },
                  tuoi: { type: 'integer', minimum: 1, maximum: 120 },
                  anh_dai_dien: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            nguoi_dung_id: { type: 'integer' },
                            email: { type: 'string' },
                            ho_ten: { type: 'string' },
                            tuoi: { type: 'integer' },
                            anh_dai_dien: { type: 'string', nullable: true }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/users/images/created': {
      get: {
        tags: ['Users'],
        summary: 'Get user created images',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 20 }
          }
        ],
        responses: {
          200: {
            description: 'Created images retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        images: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              hinh_id: { type: 'integer' },
                              ten_hinh: { type: 'string' },
                              duong_dan: { type: 'string' },
                              mo_ta: { type: 'string' },
                              ngay_tao: { type: 'string', format: 'date-time' },
                              nguoi_dung: {
                                type: 'object',
                                properties: {
                                  nguoi_dung_id: { type: 'integer' },
                                  ho_ten: { type: 'string' },
                                  anh_dai_dien: { type: 'string', nullable: true }
                                }
                              },
                              _count: {
                                type: 'object',
                                properties: {
                                  binh_luan: { type: 'integer' }
                                }
                              }
                            }
                          }
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            page: { type: 'integer' },
                            limit: { type: 'integer' },
                            total: { type: 'integer' },
                            pages: { type: 'integer' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/users/images/saved': {
      get: {
        tags: ['Users'],
        summary: 'Get user saved images',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 20 }
          }
        ],
        responses: {
          200: {
            description: 'Saved images retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        images: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              hinh_id: { type: 'integer' },
                              ten_hinh: { type: 'string' },
                              duong_dan: { type: 'string' },
                              mo_ta: { type: 'string' },
                              ngay_tao: { type: 'string', format: 'date-time' },
                              nguoi_dung: {
                                type: 'object',
                                properties: {
                                  nguoi_dung_id: { type: 'integer' },
                                  ho_ten: { type: 'string' },
                                  anh_dai_dien: { type: 'string', nullable: true }
                                }
                              }
                            }
                          }
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            page: { type: 'integer' },
                            limit: { type: 'integer' },
                            total: { type: 'integer' },
                            pages: { type: 'integer' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/comments/image/{imageId}': {
      get: {
        tags: ['Comments'],
        summary: 'Get comments for an image',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'imageId',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Comments retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        comments: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              binh_luan_id: { type: 'integer' },
                              noi_dung: { type: 'string' },
                              ngay_binh_luan: { type: 'string', format: 'date-time' },
                              nguoi_dung: {
                                type: 'object',
                                properties: {
                                  nguoi_dung_id: { type: 'integer' },
                                  ho_ten: { type: 'string' },
                                  anh_dai_dien: { type: 'string', nullable: true }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Comments'],
        summary: 'Add a comment to an image',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'imageId',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['noi_dung'],
                properties: {
                  noi_dung: { type: 'string', maxLength: 255 }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Comment added',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        comment: {
                          type: 'object',
                          properties: {
                            binh_luan_id: { type: 'integer' },
                            noi_dung: { type: 'string' },
                            ngay_binh_luan: { type: 'string', format: 'date-time' },
                            nguoi_dung: {
                              type: 'object',
                              properties: {
                                nguoi_dung_id: { type: 'integer' },
                                ho_ten: { type: 'string' },
                                anh_dai_dien: { type: 'string', nullable: true }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/comments/{commentId}': {
      delete: {
        tags: ['Comments'],
        summary: 'Delete a comment',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'commentId',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Comment deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          404: { description: 'Comment not found or no permission' }
        }
      }
    },
    '/api/saved/check/{imageId}': {
      get: {
        tags: ['Saved Images'],
        summary: 'Check if image is saved',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'imageId',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Save status checked',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        saved: { type: 'boolean' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/saved/{imageId}': {
      post: {
        tags: ['Saved Images'],
        summary: 'Save an image',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'imageId',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Image saved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        saved: { type: 'boolean' },
                        message: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Saved Images'],
        summary: 'Unsave an image',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'imageId',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Image unsaved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        saved: { type: 'boolean' },
                        message: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/saved': {
      get: {
        tags: ['Saved Images'],
        summary: 'Get all saved images',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 20 }
          }
        ],
        responses: {
          200: {
            description: 'Saved images retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        images: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              hinh_id: { type: 'integer' },
                              ten_hinh: { type: 'string' },
                              duong_dan: { type: 'string' },
                              mo_ta: { type: 'string' },
                              ngay_tao: { type: 'string', format: 'date-time' },
                              nguoi_dung: {
                                type: 'object',
                                properties: {
                                  nguoi_dung_id: { type: 'integer' },
                                  ho_ten: { type: 'string' },
                                  anh_dai_dien: { type: 'string', nullable: true }
                                }
                              }
                            }
                          }
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            page: { type: 'integer' },
                            limit: { type: 'integer' },
                            total: { type: 'integer' },
                            pages: { type: 'integer' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
