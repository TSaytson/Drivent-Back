import { notFoundError, ticketIdError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import ticketsService from '@/services/tickets-service';

describe('tickets service unit tests suite', () => {
  describe('getTicketsType unit tests suite', () => {
    it('should find ticket types', async () => {
      const spy = jest.spyOn(ticketsRepository, 'getTicketsTypes').mockImplementation((): any => {
        return [];
      });
      await ticketsService.getTicketsTypes();
      expect(spy).toBeCalled();
    });
  });
  describe('getTickets unit tests suite', () => {
    it('should throw an error when no enrollment is found', () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return null;
      });
      const promise = ticketsService.getTickets(1);
      expect(promise).rejects.toEqual(notFoundError());
    });
    it('should throw an error when no ticket is found', () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return {};
      });
      jest.spyOn(ticketsRepository, 'getTicketByEnrollmentId').mockImplementationOnce((): any => {
        return null;
      });
      const promise = ticketsService.getTickets(1);
      expect(promise).rejects.toEqual(notFoundError());
    });
    it('should return a ticket', () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return {};
      });
      jest.spyOn(ticketsRepository, 'getTicketByEnrollmentId').mockImplementationOnce((): any => {
        return {};
      });
      const promise = ticketsService.getTickets(1);
      expect(promise).resolves.toEqual({});
    });
  });
  describe('createTicket unit tests suite', () => {
    it('should throw an error when there is no ticket type id', () => {
      const promise = ticketsService.createTicket(undefined, 1);
      expect(promise).rejects.toEqual(ticketIdError());
    });
    it('should throw an error when there is no enrollment', () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return null;
      });
      const promise = ticketsService.createTicket(1, 1);
      expect(promise).rejects.toEqual(notFoundError());
    });
    it('should call create ticket from ticket repository', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return {};
      });
      const spy = jest.spyOn(ticketsRepository, 'createTicket').mockImplementationOnce((): any => {
        return {};
      });
      jest.spyOn(ticketsRepository, 'getTicketByEnrollmentId').mockImplementationOnce((): any => {
        return undefined;
      });
      await ticketsService.createTicket(1, 1);
      expect(spy).toBeCalled();
    });
  });
});
