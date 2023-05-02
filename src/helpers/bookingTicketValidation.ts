import {
  hotelNotIncludedError,
  noEnrollmentFound,
  notPaidTicketError,
  remoteTicketError,
  ticketNotFound,
  ticketOwnerError,
} from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function verifyTicketForBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw noEnrollmentFound();
  const ticket = await ticketsRepository.getTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw ticketNotFound();
  if (enrollment.id !== ticket.enrollmentId) throw ticketOwnerError();
  if (ticket.status !== 'PAID') throw notPaidTicketError();
  if (ticket.TicketType.isRemote) throw remoteTicketError();
  if (!ticket.TicketType.includesHotel) throw hotelNotIncludedError();
  return { ticket, enrollment };
}
