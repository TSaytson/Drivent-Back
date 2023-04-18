import joi from 'joi';

export const ticketSchema = joi.object({
  ticketTypeId: joi.number().integer().min(1).required(),
});
