import { Payment } from '@prisma/client';
import { prisma } from '@/config';

function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

function registerPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) {
  return prisma.payment.create({
    data: payment,
  });
}

const paymentRepository = {
  getPayment,
  registerPayment,
};

export default paymentRepository;
