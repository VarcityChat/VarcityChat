import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().required().email().messages({
    'string.base': 'Enter a valid email',
    'string.required': 'Enter a valid email',
    'string.email': 'Enter a valid email'
  }),
  password: Joi.string().required().min(3).max(30).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field'
  })
});

export { loginSchema };
