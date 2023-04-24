import supertest from 'supertest';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
} from '../factories';
import app, { init } from '@/app';
import { prisma } from '@/config';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await prisma.$disconnect();
});

const server = supertest(app);

async function createBooking(userId: number) {
  await prisma.hotel.createMany({
    data: [
      {
        name: 'Copacabana Palace',
        image: 'qualquer',
      },
      {
        name: 'Ibis Premium',
        image: 'qualquer outra',
      },
    ],
  });
  const hotels = await prisma.hotel.findMany();
  const hotel = await prisma.hotel.findFirst();
  const room = await prisma.room.create({
    data: {
      name: '200',
      capacity: 2,
      hotelId: hotel.id,
    },
  });
  await prisma.booking.create({
    data: {
      userId,
      roomId: room.id,
    },
  });
  return hotels;
}

describe('GET /hotels', () => {
  it(`should respond with status 404 if there is no 
    ticket`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it(`should respond with status 404 if there is no 
    enrollment`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`).send({ ticketId: 99999 });
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it(`should respond with status 404 if there is no 
    hotel`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: TicketStatus.PAID },
    });
    await prisma.ticketType.update({
      where: { id: ticketType.id },
      data: {
        isRemote: false,
        includesHotel: true,
      },
    });
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`).send({ ticketId: ticket.id });
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it(`should respond with status 402 if ticket hasn't 
    been payed`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`).send({ ticketId: ticket.id });
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it(`should respond with status 402 if is ticketType is
    remote`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`).send({ ticketId: ticket.id });
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it(`should respond with status 402 if ticket doesn't 
    includes hotel`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`).send({ ticketId: ticket.id });
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it(`should respond with 200 when ticket includes hotel
  and there is hotels`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: TicketStatus.PAID },
    });
    await prisma.ticketType.update({
      where: { id: ticketType.id },
      data: {
        isRemote: false,
        includesHotel: true,
      },
    });
    const hotels = await createBooking(user.id);
    console.log(hotels);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`).send({ ticketId: ticket.id });
    expect(response.status).toBe(httpStatus.OK);
  });
  describe('GET /hotels/:hotelId', () => {
    it(`should respond with 404 if there is no hotel 
        corresponding to hotelId`, async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { status: TicketStatus.PAID },
      });
      await prisma.ticketType.update({
        where: { id: ticketType.id },
        data: {
          isRemote: false,
          includesHotel: true,
        },
      });
      const hotels = await createBooking(user.id);
      const response = await server
        .get(`/hotels/${hotels[0].id - 1}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ tiketId: ticket.id });
      expect(response.status).toBe(404);
    });
  });
});
