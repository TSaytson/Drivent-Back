import { Booking } from '@prisma/client';
import { roomNotFoundError } from '@/errors';
import { verifyTicketForBooking } from '@/helpers';
import bookingRepository from '@/repositories/booking-repository';

async function getBooking(userId: number, bookingId: number) {
  await verifyTicketForBooking(userId);
  const room = await bookingRepository.findBooking(bookingId);
  if (!room) throw roomNotFoundError();
  return room;
}
async function createBooking(userId: number, bookingId: number) {
  await verifyTicketForBooking(userId);
  const room = await bookingRepository.findBooking(bookingId);
  if (!room) throw roomNotFoundError();
  return await bookingRepository.createBooking(room.id, userId);
}

export type BookingParams = Omit<Booking, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

const bookingsService = {
  getBooking,
  createBooking,
};

export default bookingsService;
