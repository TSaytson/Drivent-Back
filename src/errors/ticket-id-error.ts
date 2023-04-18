import { ApplicationError } from '@/protocols';

export function ticketIdError(): ApplicationError {
  return {
    name: 'TicketIdError',
    message: 'Ticket id has an error',
  };
}

export function ticketNotFound(): ApplicationError {
  return {
    name: 'TicketNotFoundError',
    message: 'Ticket not found',
  };
}

export function ticketOwnerError(): ApplicationError {
  return {
    name: 'TicketOwnerError',
    message: 'Ticket does not belong to user',
  };
}
