import { prisma } from '@/config';

function getTickets(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true,
    },
  });
}

function getTicket(id: number) {
  return prisma.ticket.findFirst({
    where: { id },
  });
}

function getTicketsTypes() {
  return prisma.ticketType.findMany();
}

function getTicketType(id: number) {
  return prisma.ticketType.findFirst({
    where: { id },
  });
}

const ticketsRepository = {
  getTicketsTypes,
  getTickets,
  getTicketType,
  getTicket,
};

export default ticketsRepository;
