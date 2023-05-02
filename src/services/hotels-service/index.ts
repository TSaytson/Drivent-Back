import hotelRepository from '@/repositories/hotel-repository';
import { verifyTicketAndEnrollment, verifyTicketForBooking } from '@/helpers/';
import { hotelNotIncludedError, noHotelsFoundError, notPaidTicketError, remoteTicketError } from '@/errors';

export async function getHotels(ticketId: number, userId: number) {
  const ticket = await verifyTicketAndEnrollment(ticketId, userId);
  await verifyTicketForBooking(ticket.id, userId);
  const hotels = await hotelRepository.getHotels();
  if (!hotels.length) throw noHotelsFoundError();
  return hotels;
}

export async function getHotelById(ticketId: number, userId: number, hotelId: number) {
  const ticket = await verifyTicketAndEnrollment(ticketId, userId);
  await verifyTicketForBooking(ticket.id, userId);
  const hotel = await hotelRepository.getHotelById(hotelId);
  if (!hotel) throw noHotelsFoundError();
}

const hotelsSerivce = {
  getHotels,
  getHotelById,
};

export default hotelsSerivce;
