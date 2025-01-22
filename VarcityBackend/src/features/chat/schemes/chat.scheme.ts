import Joi, { ObjectSchema } from 'joi';

const addChatSchema: ObjectSchema = Joi.object().keys({
  conversationId: Joi.string().optional().allow(null, ''),
  sender: Joi.string().required(),
  receiver: Joi.string().required(),
  content: Joi.string().optional().allow(null, ''),
  mediaUrls: Joi.array().max(5).optional(),
  mediaType: Joi.string().optional().allow(null, ''),
  reply: Joi.object().optional(),
  conversationStatus: Joi.string().optional()
});

export { addChatSchema };
