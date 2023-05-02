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

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
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

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
  });
}

const bookingRepository = {
  findBooking,
  findBookingByUserId,
  createBooking,
  updateBooking,
};

export default bookingRepository;
