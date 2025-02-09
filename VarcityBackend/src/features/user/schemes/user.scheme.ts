import { RelationshipStatus } from '@user/interfaces/user.interface';
import Joi, { ObjectSchema } from 'joi';

const updateUserSchema: ObjectSchema = Joi.object().keys({
  firstname: Joi.string().max(60).messages({
    'string.base': 'First name must be of type string',
    'string.max': 'Name too long',
    'string.empty': 'First name is a required field'
  }),
  lastname: Joi.string().max(60).messages({
    'string.base': 'Last name must be of type string',
    'string.max': 'Name too long',
    'string.empty': 'Last name is a required field'
  }),
  images: Joi.array().max(5).messages({
    'array.base': 'Images must be of type array',
    'array.min': 'invalid array length',
    'array.max': 'invalid array length'
  }),
  mobileNumber: Joi.string().max(20).messages({
    'string.base': 'Mobile Number must be of type string',
    'string.max': 'Mobile Number too long'
  }),
  course: Joi.string().optional().max(60).messages({
    'string.base': 'Course must be of type string',
    'string.max': 'Course name too long',
    'string.empty': 'Course is a required field'
  }),
  relationshipStatus: Joi.string()
    .allow(RelationshipStatus.SINGLE, RelationshipStatus.DATING, RelationshipStatus.MARRIED)
    .max(40)
    .messages({
      'string.base': 'Relationship Status must be of type string',
      'string.empty': 'Please select your relationship status'
    }),
  lookingFor: Joi.string().max(40).messages({
    'string.base': 'Looking for must be of type string'
  }),
  about: Joi.string().max(250).messages({
    'string.base': 'About must be of type string'
  }),
  hobbies: Joi.array().max(10).messages({
    'array.base': 'hobbies must be of type array',
    'array.max': 'Too many hobbies selected'
  })
});

export { updateUserSchema };
