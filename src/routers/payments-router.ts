import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createPayment, getPaymentByTicket } from '@/controllers';
import { createEnrollmentSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/payments?ticketId=1', getPaymentByTicket)
  .post('/payments/process', validateBody(createEnrollmentSchema), createPayment);

export { paymentsRouter };
