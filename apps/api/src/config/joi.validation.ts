import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGO_URI: Joi.string().required(),
  PORT: Joi.number().required(),
  MONGO_DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),
});
