import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  updateTicketIncludesHotel,
  updateTicketStatusPaid,
  createBooking,
  createHotel,
  createRoom,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { invalidTokenVerification } from '../helpers/validationTests-helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';
import ticketsRepository from '@/repositories/tickets-repository';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  invalidTokenVerification('/booking');
  it('Should respond with statusCode 200 and a body with bookingId and room', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await updateTicketStatusPaid(ticket.id);
    await updateTicketIncludesHotel(ticketType.id);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    await createBooking(user.id, room.id);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      Room: {
        id: expect.any(Number),
        name: expect.any(String),
        capacity: expect.any(Number),
        hotelId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      id: expect.any(Number),
    });
  });
  it(`Should respond with statusCode 403 if ticket hasnt been paid`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await updateTicketIncludesHotel(ticketType.id);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    await createBooking(user.id, room.id);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(403);
  });
  it(`Should respond with statusCode 404 if there is no room found`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await updateTicketStatusPaid(ticket.id);
    await updateTicketIncludesHotel(ticketType.id);
    await createHotel();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });
});

describe('POST /booking', () => {
  invalidTokenVerification('/booking');
  it(`Should respond with statusCode 200 and bookingId 
    when there is a valid room`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await updateTicketStatusPaid(ticket.id);
    await updateTicketIncludesHotel(ticketType.id);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const body = {
      roomId: room.id,
    };
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      bookingId: expect.any(Number),
    });
  });
  it(`Should respond with statusCode 403 if there is no more room available`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await updateTicketStatusPaid(ticket.id);
    await updateTicketIncludesHotel(ticketType.id);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    await createBooking(user.id, room.id);
    const body = {
      roomId: room.id,
    };
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });
  it(`Should respond with statusCode 404 if roomId does not
    exists`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await updateTicketStatusPaid(ticket.id);
    await updateTicketIncludesHotel(ticketType.id);
    const body = {
      roomId: 9999,
    };
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
});

describe('PUT /booking/:bookingId', () => {
  invalidTokenVerification('/booking');
  it(`Should respond with statusCode 200 and bookingId 
    when there is a valid room`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await updateTicketStatusPaid(ticket.id);
    await updateTicketIncludesHotel(ticketType.id);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const { id: bookingId } = await createBooking(user.id, room.id);

    const body = {
      roomId: room.id,
    };
    const response = await server.put(`/booking/${bookingId}`).set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      bookingId: expect.any(Number),
    });
  });
  it(`Should respond with statusCode 403 if there is no more room available`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await updateTicketStatusPaid(ticket.id);
    await updateTicketIncludesHotel(ticketType.id);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const { id: bookingId } = await createBooking(user.id, room.id);
    const body = {
      roomId: room.id,
    };
    const response = await server.put(`/booking/${bookingId}`).set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });
  it(`Should respond with statusCode 404 if roomId does not
    exists`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await updateTicketStatusPaid(ticket.id);
    await updateTicketIncludesHotel(ticketType.id);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const { id: bookingId } = await createBooking(user.id, room.id);
    const body = {
      roomId: 9999,
    };
    const response = await server.put(`/booking/${bookingId}`).set('Authorization', `Bearer ${token}`).send(body);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
});
