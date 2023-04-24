import { noEnrollmentFound, ticketIdError, ticketNotFound, ticketOwnerError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function verifyTicketAndEnrollment(ticketId: number, userId: number) {
  if (!ticketId) throw ticketIdError();
  const ticket = await ticketsRepository.getTicketWithType(ticketId);
  if (!ticket) throw ticketNotFound();
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw noEnrollmentFound();
  if (enrollment.id !== ticket.enrollmentId) throw ticketOwnerError();
  return ticket;
}
