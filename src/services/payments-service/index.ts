import { Payment } from '@prisma/client';
import { ticketIdError, ticketNotFound, ticketOwnerError } from '@/errors';
import { PaymentBody } from '@/protocols/index';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepository from '@/repositories/payment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

export async function getPayment(ticketId: number, userId: number) {
  if (!ticketId) throw ticketIdError();
  const ticketFound = await ticketsRepository.getTicket(ticketId);
  if (!ticketFound) throw ticketNotFound();
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (enrollment.id !== ticketFound.enrollmentId) throw ticketOwnerError();
  const payment = await paymentRepository.getPayment(ticketId);
  return payment;
}

export async function createPayment({ ticketId, cardData }: PaymentBody, userId: number) {
  if (!ticketId) throw ticketIdError();
  const ticket = await ticketsRepository.getTicketWithType(ticketId);
  if (!ticket) throw ticketNotFound();
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (enrollment.id !== ticket.enrollmentId) throw ticketOwnerError();

  const payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'> = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  const result = await paymentRepository.registerPayment(payment);
  await ticketsRepository.updateTicketStatus(ticketId);
  return result;
}

const paymentsService = {
  getPayment,
  createPayment,
};

export default paymentsService;
