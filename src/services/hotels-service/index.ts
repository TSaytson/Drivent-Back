import hotelRepository from '@/repositories/hotel-repository';
import { verifyTicketAndEnrollment, verifyTicketForBooking } from '@/helpers/';
import { noHotelsFoundError } from '@/errors';

export async function getHotels(ticketId: number, userId: number) {
  await verifyTicketAndEnrollment(ticketId, userId);
  await verifyTicketForBooking(userId);
  const hotels = await hotelRepository.getHotels();
  if (!hotels.length) throw noHotelsFoundError();
  return hotels;
}

export async function getHotelById(ticketId: number, userId: number, hotelId: number) {
  await verifyTicketAndEnrollment(ticketId, userId);
  await verifyTicketForBooking(userId);
  const hotel = await hotelRepository.getHotelById(hotelId);
  if (!hotel) throw noHotelsFoundError();
}

const hotelsSerivce = {
  getHotels,
  getHotelById,
};

export default hotelsSerivce;
