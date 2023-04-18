import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createPayment, getPayment } from '@/controllers';
import { paymentSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPayment)
  .post('/process', validateBody(paymentSchema), createPayment);

export { paymentsRouter };
