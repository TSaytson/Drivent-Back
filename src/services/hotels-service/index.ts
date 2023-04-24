import hotelRepository from '@/repositories/hotel-repository';
import { verifyTicketAndEnrollment } from '@/helpers';
import { hotelNotIncludedError, noHotelsFoundError, notPaidTicketError, remoteTicketError } from '@/errors';

export async function getHotels(ticketId: number, userId: number) {
  const ticket = await verifyTicketAndEnrollment(ticketId, userId);
  if (ticket.status !== 'PAID') throw notPaidTicketError();
  if (ticket.TicketType.isRemote) throw remoteTicketError();
  if (!ticket.TicketType.includesHotel) throw hotelNotIncludedError();
  const hotels = await hotelRepository.getHotels();
  if (!hotels.length) throw noHotelsFoundError();
  return hotels;
}

export async function getHotelById(ticketId: number, userId: number, hotelId: number) {
  const ticket = await verifyTicketAndEnrollment(ticketId, userId);
  if (ticket.status !== 'PAID') throw notPaidTicketError();
  if (ticket.TicketType.isRemote) throw remoteTicketError();
  if (!ticket.TicketType.includesHotel) throw hotelNotIncludedError();
  return await hotelRepository.getHotelById(hotelId);
}

const hotelsSerivce = {
  getHotels,
  getHotelById,
};

export default hotelsSerivce;
