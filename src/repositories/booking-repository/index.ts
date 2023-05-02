import { prisma } from '@/config';

async function findBooking(id: number) {
  return prisma.booking.findUnique({
    where: { id },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function createBooking(roomId: number, userId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

const bookingRepository = {
  findBooking,
  createBooking,
};

export default bookingRepository;
