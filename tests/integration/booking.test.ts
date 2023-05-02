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
    const body = {
      roomId: 1,
    };
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
    console.log(response.error);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      bookingId: expect.any(Number),
    });
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
