import { faker } from '@faker-js/faker';
import { prisma } from '@/config';

export async function createManyHotels() {
  return prisma.hotel.createMany({
    data: [
      {
        name: faker.company.companyName(),
        image: faker.image.imageUrl(),
      },
      {
        name: faker.company.companyName(),
        image: faker.image.imageUrl(),
      },
    ],
  });
}

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
    },
  });
}
