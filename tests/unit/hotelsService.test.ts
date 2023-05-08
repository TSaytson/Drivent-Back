import { generateHotels } from '../factories';
import { noHotelsFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';
import hotelsSerivce from '@/services/hotels-service';

jest.mock('@/helpers/paymentTicketValidation', () => ({
  verifyTicketAndEnrollment: () => {
    return;
  },
}));
jest.mock('@/helpers/bookingTicketValidation', () => ({
  verifyTicketForBooking: () => {
    return;
  },
}));
describe('hotels service unit tests suite', () => {
  describe('get hotels unit tests suite', () => {
    it('should throw an error when there is no hotels', () => {
      jest.spyOn(hotelRepository, 'getHotels').mockImplementationOnce((): any => {
        return [];
      });
      const promise = hotelsSerivce.getHotels(1, 1);
      expect(promise).rejects.toEqual(noHotelsFoundError());
    });
    it('should return hotels', () => {
      jest.spyOn(hotelRepository, 'getHotels').mockImplementationOnce((): any => {
        return generateHotels();
      });
      const promise = hotelsSerivce.getHotels(1, 1);
      expect(promise).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            image: expect.any(String),
          }),
        ]),
      );
    });
  });
  describe('get hotel by id unit tests suite', () => {
    it('should throw and error when there is no hotel with such id', () => {
      jest.spyOn(hotelRepository, 'getHotelById').mockImplementationOnce((): any => {
        return null;
      });
      const promise = hotelsSerivce.getHotelById(1, 1, 1);
      expect(promise).rejects.toEqual(noHotelsFoundError());
    });
  });
});
