import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsSerivce from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketId = Number(req.body.ticketId);

  try {
    const result = await hotelsSerivce.getHotels(ticketId, userId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    if (
      error.name === 'NotPaidTicketError' ||
      error.name === 'RemoteTicketError' ||
      error.name === 'hotelNotIncludedError'
    )
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    if (
      error.name === 'TicketIdError' ||
      error.name === 'TicketNotFoundError' ||
      error.name === 'NoEnrollmentFound' ||
      error.name === 'NoHotelsFoundError'
    )
      return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);
  const ticketId = Number(req.body.ticketId);

  try {
    const result = await hotelsSerivce.getHotelById(ticketId, userId, hotelId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    if (
      error.name === 'NotPaidTicketError' ||
      error.name === 'RemoteTicketError' ||
      error.name === 'hotelNotIncludedError'
    )
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    if (
      error.name === 'TicketIdError' ||
      error.name === 'TicketNotFoundError' ||
      error.name === 'NoEnrollmentFound' ||
      error.name === 'NoHotelsFoundError'
    )
      return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
