import { verifyTicketAndEnrollment } from './paymentTicketValidation';
import { hotelNotIncludedError, notPaidTicketError, remoteTicketError } from '@/errors';

export async function verifyTicketForBooking(userId: number) {
  const { ticket, enrollment } = await verifyTicketAndEnrollment(userId);
  if (ticket.status !== 'PAID') throw notPaidTicketError();
  if (ticket.TicketType.isRemote) throw remoteTicketError();
  if (!ticket.TicketType.includesHotel) throw hotelNotIncludedError();
  return { ticket, enrollment };
}
