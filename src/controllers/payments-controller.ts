import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';
import { PaymentBody } from '@/protocols/index';

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const ticketId = Number(req.query.ticketId);
  const { userId } = req;
  try {
    const payment = await paymentsService.getPayment(ticketId, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'TicketIdError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.name === 'TicketNotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'TicketOwnerError') return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId, cardData } = req.body as PaymentBody;
  const { userId } = req;
  try {
    const response = await paymentsService.createPayment({ ticketId, cardData }, userId);

    if (!response) return res.sendStatus(httpStatus.NOT_FOUND);

    return res.status(httpStatus.OK).send(response);
  } catch (error) {
    if (error.name === 'TicketIdError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.name === 'TicketNotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'TicketOwnerError') return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
