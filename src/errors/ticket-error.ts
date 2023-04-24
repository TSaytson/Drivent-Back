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

export function notPaidTicketError(): ApplicationError {
  return {
    name: 'NotPaidTicketError',
    message: 'Ticket has not been paid yet',
  };
}

export function remoteTicketError(): ApplicationError {
  return {
    name: 'RemoteTicketError',
    message: 'Ticket type is for remote event',
  };
}

export function hotelNotIncludedError(): ApplicationError {
  return {
    name: 'HotelNotIncludedError',
    message: 'Ticket has no hotel included',
  };
}
