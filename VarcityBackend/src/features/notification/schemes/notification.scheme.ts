import Joi, { ObjectSchema } from 'joi';

const notificationMessageSchema: ObjectSchema = Joi.object().keys({
  title: Joi.string().min(1).max(200).required().messages({
    'string.base': 'title must be a string',
    'string.min': 'title length is too small',
    'string.max': 'title length is too large',
    'string.empty': 'title is a required field',
    'string.required': 'title is a required field'
  }),
  message: Joi.string().min(2).max(1000).required().messages({
    'string.base': 'message must be a string',
    'string.min': 'message length is too small',
    'string.max': 'message length is too large',
    'string.empty': 'message is a required field',
    'string.required': 'message is a required field'
  })
});

export { notificationMessageSchema };
