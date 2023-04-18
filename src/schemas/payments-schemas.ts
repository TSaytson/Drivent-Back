import joi from 'joi';

export const paymentSchema = joi.object({
  ticketId: joi.number().integer().min(1).required(),
  cardData: joi
    .object({
      issuer: joi.string().required(),
      number: joi.number().required(),
      name: joi.string().required(),
      expirationDate: joi.date().required(),
      cvv: joi.number().min(3).required(),
    })
    .required(),
});
