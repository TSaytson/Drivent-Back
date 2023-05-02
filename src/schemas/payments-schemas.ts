import joi from 'joi';
import { PaymentParams } from '@/services/payments-service';

export const paymentSchema = joi.object<PaymentParams>({
  ticketId: joi.number().integer().min(1).required(),
  cardData: joi
    .object({
      issuer: joi.string().required(),
      number: joi.number().required(),
      name: joi.string().required(),
      expirationDate: joi.string().required(),
      cvv: joi.number().min(3).required(),
    })
    .required(),
});
