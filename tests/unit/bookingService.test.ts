import faker from '@faker-js/faker';
import { bookingConflictError, bookingNotFoundError, maximumCapacityError, roomNotFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import roomRepository from '@/repositories/room-repository';
import bookingsService from '@/services/bookings-service';

jest.mock('@/helpers/bookingTicketValidation', () => ({
  verifyTicketForBooking: () => {
    return;
  },
}));

describe('booking service unit tests suite', () => {
  describe('get booking unit tests suite', () => {
    it('should throw an error when there is no booking', () => {
      jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
        return null;
      });
      const promise = bookingsService.getBooking(1);
      expect(promise).rejects.toEqual(bookingNotFoundError());
    });
    it('should return a booking', () => {
      jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
        return [];
      });
      const promise = bookingsService.getBooking(1);
      expect(promise).resolves.toEqual([]);
    });
  });
  describe('create booking unit tests suite', () => {
    it('should throw an error whe there is no room found', () => {
      jest.spyOn(roomRepository, 'findRoom').mockImplementationOnce((): any => {
        return null;
      });
      const promise = bookingsService.createBooking(1, 1);
      expect(promise).rejects.toEqual(roomNotFoundError());
    });
    it('should throw an error when there is a booking already', () => {
      jest.spyOn(roomRepository, 'findRoom').mockImplementationOnce((): any => {
        return [];
      });
      jest.spyOn(bookingRepository, 'findBookingByRoom').mockImplementationOnce((): any => {
        return [''];
      });
      const promise = bookingsService.createBooking(1, 1);
      expect(promise).rejects.toEqual(bookingConflictError());
    });
    // it('should throw an error when maximum room capacity is reached', () => {
    //   jest.spyOn(roomRepository, 'findRoom').mockImplementationOnce((): any => {
    //     return [{
    //       capacity: 2
    //     }];
    //   })
    //   jest.spyOn(bookingRepository, 'findBookingByRoom').mockImplementationOnce((): any => {
    //     return faker.datatype.array(9999);
    //   });
    //   const promise = bookingsService.createBooking(1, 1);
    //   expect(promise).rejects.toEqual(maximumCapacityError());
    // })
  });
  describe('update booking unit tests suite', () => {
    it('should throw an error whe there is no room found', () => {
      jest.spyOn(roomRepository, 'findRoom').mockImplementationOnce((): any => {
        return null;
      });
      const promise = bookingsService.updateBooking(1, 1, 1);
      expect(promise).rejects.toEqual(roomNotFoundError());
    });
    it('should throw an error when there is no booking', () => {
      jest.spyOn(roomRepository, 'findRoom').mockImplementationOnce((): any => {
        return [];
      });
      jest.spyOn(bookingRepository, 'findBookingByRoom').mockImplementationOnce((): any => {
        return [];
      });
      const promise = bookingsService.updateBooking(1, 1, 1);
      expect(promise).rejects.toEqual(bookingNotFoundError());
    });
    // it('should throw an error when maximum room capacity is reached', () => {
    //   jest.spyOn(roomRepository, 'findRoom').mockImplementationOnce((): any => {
    //     return [{
    //       capacity: 2
    //     }];
    //   })
    //   jest.spyOn(bookingRepository, 'findBookingByRoom').mockImplementationOnce((): any => {
    //     return faker.datatype.array(9999);
    //   });
    //   const promise = bookingsService.updateBooking(1, 1, 1);
    //   expect(promise).rejects.toEqual(maximumCapacityError());
    // })
  });
});
