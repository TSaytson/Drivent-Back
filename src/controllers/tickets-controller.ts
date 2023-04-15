import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  const ticketsTypes = await ticketsService.getTicketsTypes();

  return res.status(200).send(ticketsTypes);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const tickets = await ticketsService.getTickets();
}
