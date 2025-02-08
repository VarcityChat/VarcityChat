import Joi, { ObjectSchema } from 'joi';

const addChatSchema: ObjectSchema = Joi.object().keys({
  conversationId: Joi.string().optional().allow(null, ''),
  sender: Joi.string().required(),
  receiver: Joi.string().required(),
  content: Joi.string().optional().allow(null, ''),
  mediaUrls: Joi.array().max(5).optional(),
  mediaType: Joi.string().optional().allow(null, ''),
  reply: Joi.object().optional(),
  conversationStatus: Joi.string().optional(),
  localId: Joi.string().required()
});

const addConversationSchema: ObjectSchema = Joi.object().keys({
  targetUserId: Joi.string().required()
});

const acceptConversationSchema: ObjectSchema = Joi.object().keys({
  conversationId: Joi.string().required()
});

export { addChatSchema, addConversationSchema, acceptConversationSchema };
