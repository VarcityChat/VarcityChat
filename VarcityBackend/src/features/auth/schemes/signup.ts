import { Gender, RelationshipStatus } from '@user/interfaces/user.interface';
import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().required().email().max(60).messages({
    'string.base': 'Enter a valid email',
    'string.required': 'Enter a valid email',
    'string.email': 'Enter a valid email',
    'string.empty': 'Please enter your email'
  }),
  password: Joi.string().required().min(3).max(30).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Password is a required field'
  }),
  firstname: Joi.string().required().max(60).messages({
    'string.base': 'First name must be of type string',
    'string.max': 'Name too long',
    'string.empty': 'First name is a required field'
  }),
  lastname: Joi.string().required().max(60).messages({
    'string.base': 'Last name must be of type string',
    'string.max': 'Name too long',
    'string.empty': 'Last name is a required field'
  }),
  images: Joi.array().max(5).messages({
    'array.base': 'Images must be of type array',
    'array.min': 'invalid array length',
    'array.max': 'invalid array length'
  }),
  university: Joi.string().required().max(60).messages({
    'string.base': 'University must be of type string',
    'string.max': 'University name too long',
    'string.empty': 'University is a required field'
  }),
  gender: Joi.string().allow(Gender.FEMALE, Gender.MALE).required().messages({
    'string.base': 'Gender must be of type string',
    'string.empty': 'Please select your gender'
  }),
  mobileNumber: Joi.string().max(20).messages({
    'string.base': 'Mobile Number must be of type string',
    'string.max': 'Mobile Number too long'
  }),
  relationshipStatus: Joi.string()
    .allow(RelationshipStatus.SINGLE, RelationshipStatus.DATING, RelationshipStatus.MARRIED)
    .required()
    .max(40)
    .messages({
      'string.base': 'Relationship Status must be of type string',
      'string.empty': 'Please select your relationship status'
    }),
  lookingFor: Joi.string().required().max(40).messages({
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

export { signupSchema };
