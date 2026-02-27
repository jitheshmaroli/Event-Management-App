import { SERVICE_CATEGORIES } from '@/constants/service.constants';
import Joi from 'joi';

export const createServiceSchema = Joi.object({
  title: Joi.string().min(3).max(120).trim().required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title cannot exceed more than 120 characters',
  }),
  category: Joi.string()
    .valid(...SERVICE_CATEGORIES.map((c) => c.value))
    .required()
    .messages({
      'any.only': 'Please select a valid category',
    }),
  description: Joi.string().min(200).max(3000).trim().required().messages({
    'string.min': 'Description must be atleast 200 characters',
    'string.max': 'Descripton cannot exceed more than 3000 characters',
  }),
  pricePerDay: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
  }),
  location: Joi.string().max(100).trim().allow(''),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .allow('')
    .messages({
      'string.pattern.base':
        'Please enter a valid 10-digit Indian phone number',
    }),

  availability: Joi.object({
    availableRanges: Joi.array()
      .items(
        Joi.object({
          from: Joi.date().iso().required(),
          to: Joi.date().iso().min(Joi.ref('from')).required(),
        })
      )
      .optional(),

    bookedRanges: Joi.array()
      .items(
        Joi.object({
          from: Joi.date().iso().required(),
          to: Joi.date().iso().min(Joi.ref('from')).required(),
        })
      )
      .optional(),
  }).required(),

  images: Joi.array().optional(),
});

export const updateServiceSchema = Joi.object({
  title: Joi.string().min(1).max(120).trim().optional(),
  category: Joi.string()
    .valid(...SERVICE_CATEGORIES.map((c) => c.value))
    .lowercase()
    .optional(),
  description: Joi.string().min(1).max(3000).trim().optional(),
  pricePerDay: Joi.number().min(100).optional(),
  location: Joi.string().min(1).max(100).trim().optional(),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional(),

  availability: Joi.object({
    availableRanges: Joi.array()
      .items(
        Joi.object({
          from: Joi.date().iso().required(),
          to: Joi.date().iso().min(Joi.ref('from')).required(),
        })
      )
      .optional(),

    bookedRanges: Joi.array()
      .items(
        Joi.object({
          from: Joi.date().iso().required(),
          to: Joi.date().iso().min(Joi.ref('from')).required(),
        })
      )
      .optional(),
  }).optional(),

  removedImages: Joi.array().items(Joi.string()).optional(),

  images: Joi.array().items(Joi.string()).optional(),
}).unknown(false);

export const serviceQuerySchema = Joi.object({
  search: Joi.string().trim().max(100).allow(''),
  category: Joi.string().lowercase().allow(''),
  minPrice: Joi.number().min(0).allow(''),
  maxPrice: Joi.number().min(0).allow(''),
  dateFrom: Joi.date().iso().allow(''),
  dateTo: Joi.date().iso().allow(''),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(4).max(50).default(12),
  sort: Joi.string()
    .valid('price_asc', 'price_desc', 'newest', 'oldest')
    .default('newest'),
}).unknown(false);

export const serviceIdSchema = Joi.object({
  serviceId: Joi.string().required().messages({
    'string.empty': 'Service ID is required',
    'any.required': 'Service ID is required',
  }),
});

export const availabilityParamsSchema = Joi.object({
  serviceId: Joi.string().required().messages({
    'string.empty': 'Service ID is required',
    'any.required': 'Service ID is required',
  }),
});

export const availabilityQuerySchema = Joi.object({
  year: Joi.number().integer().min(2020).max(2035).required().messages({
    'number.base': 'Year must be a valid number',
    'number.min': 'Year cannot be before 2020',
    'number.max': 'Year cannot be after 2035',
    'any.required': 'Year is required',
  }),

  month: Joi.number().integer().min(1).max(12).required().messages({
    'number.base': 'Month must be a valid number',
    'number.min': 'Month must be between 1 and 12',
    'number.max': 'Month must be between 1 and 12',
    'any.required': 'Month is required',
  }),
}).unknown(false);
