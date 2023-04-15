import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';

export async function getPaymentByTicket(req: AuthenticatedRequest, res: Response) {
  return res.status(200).send();
}

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  return res.status(200).send();
}
