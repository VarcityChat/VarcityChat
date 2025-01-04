import Joi, { ObjectSchema } from 'joi';

const uniSchema: ObjectSchema = Joi.object().keys({
  name: Joi.string().required().max(60).messages({
    'string.base': 'Name must be of type string',
    'string.max': 'Name too long',
    'string.empty': 'Name is a required field'
  }),
  image: Joi.string().required().messages({
    'string.base': 'Image must be of type string',
    'string.empty': 'Image is a required field'
  }),
  address: Joi.string().min(1).max(200).required().messages({
    'string.base': 'Address must be of type string',
    'string.min': 'Invalid uni Address',
    'string.max': 'invalid uni Address',
    'string.empty': 'Address is a required field'
  })
});

export { uniSchema };
