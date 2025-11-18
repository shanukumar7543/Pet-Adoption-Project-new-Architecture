const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Adoption API Documentation',
      version: '1.0.0',
      description: 'RESTful API documentation for the Pet Adoption System. This API allows users to browse pets, submit adoption applications, and administrators to manage pets and applications.',
      contact: {
        name: 'API Support',
        email: 'support@petadoption.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.petadoption.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login/register'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: '60d5f484f1b2c72b8c8e4f5a'
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role',
              example: 'user'
            },
            phone: {
              type: 'string',
              description: 'User phone number',
              example: '+1234567890'
            },
            address: {
              type: 'string',
              description: 'User address',
              example: '123 Main St, City, State 12345'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            }
          }
        },
        Pet: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Pet ID',
              example: '60d5f484f1b2c72b8c8e4f5b'
            },
            name: {
              type: 'string',
              description: 'Pet name',
              example: 'Buddy'
            },
            species: {
              type: 'string',
              enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'],
              description: 'Pet species',
              example: 'Dog'
            },
            breed: {
              type: 'string',
              description: 'Pet breed',
              example: 'Golden Retriever'
            },
            age: {
              type: 'number',
              description: 'Pet age in years',
              example: 3
            },
            gender: {
              type: 'string',
              enum: ['Male', 'Female'],
              description: 'Pet gender',
              example: 'Male'
            },
            size: {
              type: 'string',
              enum: ['Small', 'Medium', 'Large'],
              description: 'Pet size',
              example: 'Large'
            },
            color: {
              type: 'string',
              description: 'Pet color',
              example: 'Golden'
            },
            description: {
              type: 'string',
              description: 'Pet description',
              example: 'Friendly and energetic dog, great with kids'
            },
            medicalHistory: {
              type: 'string',
              description: 'Pet medical history',
              example: 'Vaccinated, no known health issues'
            },
            vaccinated: {
              type: 'boolean',
              description: 'Vaccination status',
              example: true
            },
            neutered: {
              type: 'boolean',
              description: 'Neutering status',
              example: true
            },
            photos: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of photo URLs',
              example: ['/uploads/pet-photo-1.jpg']
            },
            status: {
              type: 'string',
              enum: ['Available', 'Pending', 'Adopted'],
              description: 'Pet adoption status',
              example: 'Available'
            },
            adoptionFee: {
              type: 'number',
              description: 'Adoption fee in dollars',
              example: 150
            },
            location: {
              type: 'string',
              description: 'Pet location',
              example: 'New York, NY'
            },
            addedBy: {
              type: 'string',
              description: 'ID of admin who added the pet',
              example: '60d5f484f1b2c72b8c8e4f5a'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Pet creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Pet last update timestamp'
            }
          }
        },
        Application: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Application ID',
              example: '60d5f484f1b2c72b8c8e4f5c'
            },
            pet: {
              type: 'string',
              description: 'Pet ID',
              example: '60d5f484f1b2c72b8c8e4f5b'
            },
            applicant: {
              type: 'string',
              description: 'Applicant user ID',
              example: '60d5f484f1b2c72b8c8e4f5a'
            },
            status: {
              type: 'string',
              enum: ['Pending', 'Approved', 'Rejected'],
              description: 'Application status',
              example: 'Pending'
            },
            applicantInfo: {
              type: 'object',
              properties: {
                phone: {
                  type: 'string',
                  description: 'Applicant phone number',
                  example: '+1234567890'
                },
                address: {
                  type: 'string',
                  description: 'Applicant address',
                  example: '123 Main St, City, State 12345'
                },
                housingType: {
                  type: 'string',
                  enum: ['House', 'Apartment', 'Condo', 'Other'],
                  description: 'Type of housing',
                  example: 'House'
                },
                hasYard: {
                  type: 'boolean',
                  description: 'Has yard',
                  example: true
                },
                hasPets: {
                  type: 'boolean',
                  description: 'Currently has pets',
                  example: false
                },
                petsDescription: {
                  type: 'string',
                  description: 'Description of current pets',
                  example: '1 cat, indoor only'
                },
                experience: {
                  type: 'string',
                  description: 'Pet ownership experience',
                  example: 'Owned dogs for 10 years'
                },
                reason: {
                  type: 'string',
                  description: 'Reason for adoption',
                  example: 'Looking for a companion for my family'
                }
              }
            },
            notes: {
              type: 'string',
              description: 'Admin review notes',
              example: 'Good candidate, approved'
            },
            reviewedBy: {
              type: 'string',
              description: 'Admin who reviewed the application',
              example: '60d5f484f1b2c72b8c8e4f5a'
            },
            reviewedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Review timestamp'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Application creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Application last update timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message here'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Not authorized, token failed'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'User does not have permission to perform this action',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Not authorized to access this route'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Resource not found'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        field: {
                          type: 'string',
                          example: 'email'
                        },
                        message: {
                          type: 'string',
                          example: 'Email is required'
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
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and profile management'
      },
      {
        name: 'Pets',
        description: 'Pet listing and management'
      },
      {
        name: 'Applications',
        description: 'Adoption application management'
      },
      {
        name: 'Health',
        description: 'API health and status checks'
      }
    ]
  },
  apis: [
    './routes/*.js',
    './server.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;

