import { Payment } from '@prisma/client';
import { PaymentBody } from '@/protocols/index';
import paymentRepository from '@/repositories/payment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { verifyTicketAndEnrollment } from '@/helpers';

export async function getPayment(ticketId: number, userId: number) {
  await verifyTicketAndEnrollment(ticketId, userId);
  const payment = await paymentRepository.getPayment(ticketId);
  return payment;
}

export async function createPayment({ ticketId, cardData }: PaymentBody, userId: number) {
  const ticket = await verifyTicketAndEnrollment(ticketId, userId);

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
