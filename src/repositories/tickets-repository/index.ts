import { Ticket, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

function getTicketsTypes() {
  return prisma.ticketType.findMany();
}

function getTicketByEnrollmentId(enrollmentId: number) {
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

function getTicketWithType(id: number) {
  return prisma.ticket.findFirst({
    where: { id },
    include: { TicketType: true },
  });
}

function getTicketType(id: number) {
  return prisma.ticketType.findFirst({
    where: { id },
  });
}

function createTicket(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) {
  return prisma.ticket.create({
    data: ticket,
  });
}

function updateTicketStatus(id: number) {
  return prisma.ticket.update({
    where: { id },
    data: {
      status: TicketStatus.PAID,
    },
  });
}

const ticketsRepository = {
  getTicketsTypes,
  getTicketByEnrollmentId,
  getTicketType,
  getTicket,
  getTicketWithType,
  createTicket,
  updateTicketStatus,
};

export default ticketsRepository;
