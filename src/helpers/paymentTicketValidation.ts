import { noEnrollmentFound, ticketIdError, ticketNotFound, ticketOwnerError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function verifyTicketAndEnrollment(userId: number, ticketId?: number) {
  if (!ticketId) throw ticketIdError();
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw noEnrollmentFound();
  const ticket = await ticketsRepository.getTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw ticketNotFound();
  if (enrollment.id !== ticket.enrollmentId) throw ticketOwnerError();
  return { ticket, enrollment };
}
