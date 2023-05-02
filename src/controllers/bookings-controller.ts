import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/bookings-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingsService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (
      error.name === 'NotPaidTicketError' ||
      error.name === 'RemoteTicketError' ||
      error.name === 'HotelNotIncludedError'
    )
      return res.status(403).send(error.message);
    if (error.name === 'RoomNotFoundError') return res.status(404).send(error.message);
    console.log(error.message);
    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as { roomId: number };
  try {
    const { id: bookingId } = await bookingsService.createBooking(userId, roomId);
    return res.status(200).send({ bookingId });
  } catch (error) {
    if (
      error.name === 'NotPaidTicketError' ||
      error.name === 'RemoteTicketError' ||
      error.name === 'HotelNotIncludedError'
    )
      return res.status(403).send(error.message);
    if (error.name === 'RoomNotFoundError' || error.name === 'BookingNotFoundError')
      return res.status(404).send(error.message);
    console.log(error.message);
    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as { roomId: number };
  const bookingId = Number(req.params.bookingId);
  try {
    await bookingsService.updateBooking(userId, bookingId, roomId);
    return res.status(200).send({ bookingId });
  } catch (error) {
    if (
      error.name === 'NotPaidTicketError' ||
      error.name === 'RemoteTicketError' ||
      error.name === 'HotelNotIncludedError'
    )
      return res.status(403).send(error.message);
    if (error.name === 'RoomNotFoundError') return res.status(404).send(error.message);
    console.log(error.message);
    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
}
