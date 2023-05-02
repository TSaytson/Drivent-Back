import { ApplicationError } from '@/protocols';

export function conflictError(message: string): ApplicationError {
  return {
    name: 'ConflictError',
    message,
  };
}

export function bookingConflictError(): ApplicationError {
  return {
    name: 'BookingConflictError',
    message: 'Booking already done',
  };
}
