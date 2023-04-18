import { prisma } from '@/config';

function getPayment(id: number) {
  return prisma.payment.findFirst({
    where: { id },
  });
}

const paymentRepository = {
  getPayment,
};

export default paymentRepository;
