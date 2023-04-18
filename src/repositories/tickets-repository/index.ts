import { Ticket } from '@prisma/client';
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

function createTicket(ticket: any) {
  return prisma.ticket.create({
    data: ticket,
  });
}
const ticketsRepository = {
  getTicketsTypes,
  getTickets,
  getTicketType,
  getTicket,
  createTicket,
};

export default ticketsRepository;
