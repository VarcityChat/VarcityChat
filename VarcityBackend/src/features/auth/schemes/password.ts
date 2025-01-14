import Joi, { ObjectSchema } from 'joi';

const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().min(4).max(20).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is required'
  }),
  otp: Joi.string().length(4).required().messages({
    'string.base': 'Otp must be of type string',
    'string.empty': 'Otp is a required field'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Invalid email',
    'string.empty': 'Email is a required field'
  })
});

const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Invalid email',
    'string.empty': 'Email is a required field'
  })
});

export { passwordSchema, emailSchema };
