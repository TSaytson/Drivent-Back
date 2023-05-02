import joi from 'joi';
import { BookingParams } from '@/services/bookings-service';

export const bookingSchema = joi.object<BookingParams>({
  roomId: joi.number().min(1).required(),
});
