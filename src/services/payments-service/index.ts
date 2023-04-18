import { ticketIdError, ticketNotFound, ticketOwnerError } from '@/errors';
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
  console.log(payment);
}

export async function createPayment(ticketId: number, userId: number) {
  const ticketFound = await ticketsRepository.getTicket(ticketId);
  if (!ticketFound) throw ticketNotFound();
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (enrollment.id !== ticketFound.enrollmentId) throw ticketOwnerError();
}

const paymentsService = {
  getPayment,
  createPayment,
};

export default paymentsService;
