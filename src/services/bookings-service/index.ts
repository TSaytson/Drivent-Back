import { Booking } from '@prisma/client';
import { bookingNotFoundError, roomNotFoundError, maximumCapacityError, bookingConflictError } from '@/errors';
import { verifyTicketForBooking } from '@/helpers';
import bookingRepository from '@/repositories/booking-repository';
import roomRepository from '@/repositories/room-repository';

async function getBooking(userId: number) {
  await verifyTicketForBooking(userId);
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) throw bookingNotFoundError();
  return booking;
}

async function createBooking(userId: number, roomId: number) {
  await verifyTicketForBooking(userId);
  const room = await roomRepository.findRoom(roomId);
  if (!room) throw roomNotFoundError();
  const bookings = await bookingRepository.findBookingByRoom(roomId);
  if (bookings.length) throw bookingConflictError();
  if (bookings.length >= room.capacity) throw maximumCapacityError();
  return await bookingRepository.createBooking(room.id, userId);
}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
  await verifyTicketForBooking(userId);
  const room = await roomRepository.findRoom(roomId);
  if (!room) throw roomNotFoundError();
  const bookings = await bookingRepository.findBookingByRoom(roomId);
  if (!bookings.length) throw bookingNotFoundError();
  if (bookings.length >= room.capacity) throw maximumCapacityError();
  return await bookingRepository.updateBooking(bookingId, roomId);
}
export type BookingParams = Omit<Booking, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

const bookingsService = {
  getBooking,
  createBooking,
  updateBooking,
};

export default bookingsService;
