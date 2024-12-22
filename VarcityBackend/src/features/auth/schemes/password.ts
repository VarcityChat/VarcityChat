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
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords should match',
    'any.required': 'Confirm password is a required field'
  })
});

export { passwordSchema };
