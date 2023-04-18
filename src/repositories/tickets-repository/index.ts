import { prisma } from '@/config';

function getTickets() {
  return prisma.ticket.findMany();
}

function getTicketsTypes() {
  return prisma.ticketType.findMany();
}

const ticketsRepository = {
  getTicketsTypes,
  getTickets,
};

export default ticketsRepository;
