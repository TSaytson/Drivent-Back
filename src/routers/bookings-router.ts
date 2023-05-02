import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getBooking, createBooking, updateBooking } from '@/controllers';
import { bookingSchema } from '@/schemas/bookings-schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', validateBody(bookingSchema), createBooking)
  .put('/:bookingId', validateBody(bookingSchema), updateBooking);

export { bookingsRouter };
