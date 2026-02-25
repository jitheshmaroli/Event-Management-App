import { SERVICE_CATEGORIES, type ServiceFormData } from "@/types/service";
import Joi from "joi";

export const serviceSchema = Joi.object<ServiceFormData>({
  title: Joi.string().min(3).max(120).trim().required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed more than 120 characters",
  }),
  category: Joi.string()
    .valid(...SERVICE_CATEGORIES.map((c) => c.value))
    .required()
    .messages({
      "any.only": "Please select a valid category",
    }),
  description: Joi.string().min(200).max(3000).trim().required().messages({
    "string.min": "Description must be atleast 200 characters",
    "string.max": "Descripton cannot exceed more than 3000 characters",
  }),
  pricePerDay: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),
  location: Joi.string().max(100).trim().allow(""),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .allow("")
    .messages({
      "string.pattern.base":
        "Please enter a valid 10-digit Indian phone number",
    }),
  availability: Joi.object({
    availableRanges: Joi.array().items(Joi.any()).optional(),
    bookedRanges: Joi.array().items(Joi.any()).optional(),
  }).optional(),
  images: Joi.array().items(Joi.any()).max(6).required(),
  existingImages: Joi.array().items(Joi.string()).optional(),
});
