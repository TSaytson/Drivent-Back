import { Ticket } from '@prisma/client';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';

export async function getTicketsTypes() {
  return await ticketsRepository.getTicketsTypes();
}

export async function getTickets(userId: number): Promise<Ticket> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.getTickets(enrollment.id);
  if (!ticket) throw notFoundError();
  return ticket;
}

export async function createTicket(ticketTypeId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticketType = await ticketsRepository.getTicketType(ticketTypeId);
  console.log(ticketType);
}

const ticketsService = {
  getTicketsTypes,
  getTickets,
  createTicket,
};

export default ticketsService;
