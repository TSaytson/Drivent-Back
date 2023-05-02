import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { createUser } from '../factories';
import app from '@/app';

const server = supertest(app);

export function invalidTokenVerification(route: string) {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/tickets/types');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/tickets/types').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
}

// function enrollmentAndTicketValidation(route: string) {
//     it(`should ...`, async () {

//     })
// }
