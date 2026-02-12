import { SERVICE_CATEGORIES } from '@/constants/service.constants';
import Joi from 'joi';

export const createServiceSchema = Joi.object({
  title: Joi.string().min(1).max(120).trim().required(),

  category: Joi.string()
    .valid(...SERVICE_CATEGORIES.map((c) => c.value))
    .required()
    .lowercase(),

  description: Joi.string().min(1).max(3000).trim().required(),

  pricePerDay: Joi.number().min(100).required(),

  location: Joi.string().min(1).max(100).trim().required(),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),

  availability: Joi.object({
    availableRanges: Joi.array()
      .items(
        Joi.object({
          from: Joi.date().iso().required(),
          to: Joi.date().iso().min(Joi.ref('from')).required(),
          reason: Joi.string().trim().max(200).optional(),
        })
      )
      .optional(),

    blockedRanges: Joi.array()
      .items(
        Joi.object({
          from: Joi.date().iso().required(),
          to: Joi.date().iso().min(Joi.ref('from')).required(),
          reason: Joi.string().trim().max(200).optional(),
        })
      )
      .optional(),

    bookedRanges: Joi.array()
      .items(
        Joi.object({
          from: Joi.date().iso().required(),
          to: Joi.date().iso().min(Joi.ref('from')).required(),
          reason: Joi.string().trim().max(200).optional(),
        })
      )
      .optional(),
  }).required(),

  images: Joi.array().optional(),
});

export const updateServiceSchema = createServiceSchema.fork(
  Object.keys(createServiceSchema.describe().keys),
  (s) => s.optional()
);

export const serviceQuerySchema = Joi.object({
  search: Joi.string().trim().max(100).allow(''),
  category: Joi.string().lowercase().allow(''),
  location: Joi.string().trim().max(80).allow(''),
  minPrice: Joi.number().min(0).allow(''),
  maxPrice: Joi.number().min(Joi.ref('minPrice')).allow(''),
  date: Joi.date().iso().allow(''),
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
