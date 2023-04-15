import { Router } from 'express';
import { usersRouter } from './users-router';
import { authenticationRouter } from './authentication-router';
import { eventsRouter } from './events-router';
import { enrollmentsRouter } from './enrollments-router';
import { ticketsRouter } from './tickets-router';
import { paymentsRouter } from './payments-router';

const routes = Router();

routes
  .use('/users', usersRouter)
  .use('/auth', authenticationRouter)
  .use('/event', eventsRouter)
  .use('/enrollments', enrollmentsRouter)
  .use('/tickets', ticketsRouter)
  .use('/payments', paymentsRouter);

export default routes;
