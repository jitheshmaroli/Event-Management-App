import { SERVICE_CATEGORIES } from '@/constants/service';
import Joi from 'joi';

export const createServiceSchema = Joi.object({
  title: Joi.string().min(5).max(120).trim().required(),
  category: Joi.string()
    .valid(...SERVICE_CATEGORIES)
    .required()
    .lowercase(),
  description: Joi.string().min(20).max(3000).trim().required(),
  pricePerDay: Joi.number().min(500).required(),
  location: Joi.string().min(3).max(100).trim().required(),

  contactDetails: Joi.string()
    .custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        const { error } = Joi.object({
          phone: Joi.string()
            .pattern(/^[6-9]\d{9}$/)
            .required(),
          email: Joi.string().email().allow(''),
          whatsapp: Joi.string()
            .pattern(/^[6-9]\d{9}$/)
            .allow(''),
        }).validate(parsed, { abortEarly: false });

        if (error)
          return helpers.error('any.invalid', {
            message: error.details[0].message,
          });
        return parsed;
      } catch {
        return helpers.error('any.invalid', {
          message: 'Invalid JSON for contactDetails',
        });
      }
    })
    .required(),

  availability: Joi.string()
    .custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        const { error } = Joi.object({
          defaultAvailable: Joi.boolean().required(),
          blockedRanges: Joi.array()
            .items(
              Joi.object({
                from: Joi.date().iso().required(),
                to: Joi.date().iso().greater(Joi.ref('from')).required(),
                reason: Joi.string().trim().max(200).allow(''),
              })
            )
            .required(),
        }).validate(parsed, { abortEarly: false });

        if (error)
          return helpers.error('any.invalid', {
            message: error.details[0].message,
          });
        return parsed;
      } catch {
        return helpers.error('any.invalid', {
          message: 'Invalid JSON for availability',
        });
      }
    })
    .required(),
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
