import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';

export async function getTicketsTypes() {
  return await ticketsRepository.getTicketsTypes();
}

export async function getTickets(userId: number) {
  const enrollments = await enrollmentRepository.findWithAddressByUserId(userId);
  const tickets = await ticketsRepository.getTickets();
  if (!enrollments || !tickets.length) throw notFoundError();
}

const ticketsService = {
  getTicketsTypes,
  getTickets,
};

export default ticketsService;
