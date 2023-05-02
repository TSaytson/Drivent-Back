import { Ticket, TicketStatus } from '@prisma/client';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError, ticketIdError } from '@/errors';

export async function getTicketsTypes() {
  return await ticketsRepository.getTicketsTypes();
}

export async function getTickets(userId: number): Promise<Ticket> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.getTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  return ticket;
}

export async function createTicket(ticketTypeId: number, userId: number) {
  if (!ticketTypeId) throw ticketIdError();
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };

  await ticketsRepository.createTicket(ticket);
  const result = await ticketsRepository.getTicketByEnrollmentId(enrollment.id);
  return result;
}

export type TicketParams = {
  ticketTypeId: number;
};

const ticketsService = {
  getTicketsTypes,
  getTickets,
  createTicket,
};

export default ticketsService;
