import { fakeCreditCardData } from '../factories';
import paymentRepository from '@/repositories/payment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import paymentsService from '@/services/payments-service';

jest.mock('@/helpers/paymentTicketValidation', () => ({
  verifyTicketAndEnrollment: () => {
    return {
      ticket: {
        TicketType: {
          price: 1,
        },
      },
    };
  },
}));
describe('payments service unit tests suite', () => {
  describe('get payment unit tests suite', () => {
    it('should return a payment', () => {
      jest.spyOn(paymentRepository, 'getPayment').mockImplementationOnce((): any => {
        return {};
      });
      const promise = paymentsService.getPayment(1, 1);
      expect(promise).resolves.toEqual({});
    });
  });
  describe('create payment unit tests suite', () => {
    it('should register payment and update ticket status', async () => {
      const cardData = fakeCreditCardData();
      const paymentBody = {
        ticketId: 1,
        cardData,
      };
      jest.spyOn(paymentRepository, 'registerPayment').mockImplementationOnce((): any => {
        return {};
      });
      const spy = jest.spyOn(ticketsRepository, 'updateTicketStatus').mockImplementationOnce((): any => {
        return undefined;
      });
      const response = await paymentsService.createPayment(paymentBody, 1);
      expect(spy).toBeCalled();
      expect(response).toEqual({});
    });
  });
});
