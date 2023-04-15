import ticketsRepository from '@/repositories/tickets-repository';

export async function getTicketsTypes() {
  return await ticketsRepository.getTicketsTypes();
}

export async function getTickets() {
  return await ticketsRepository.getTickets();
}

const ticketsService = {
  getTicketsTypes,
  getTickets,
};

export default ticketsService;
