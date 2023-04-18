import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const ticketId: number = +req.query.ticketId;
  const { userId } = req;
  try {
    const payment = await paymentsService.getPayment(ticketId, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'TicketIdError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.name === 'TicketNotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'TicketOwnerError') return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  return res.status(200).send();
}

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.body as { ticketId: number };
  const { userId } = req;
  try {
    const payment = await paymentsService.createPayment(ticketId, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'TicketNotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'TicketOwnerError') return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
  return res.status(200).send();
}
