import { ApplicationError } from '@/protocols';

export function notFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'No result for this search!',
  };
}

export function noCEPMatch(): ApplicationError {
  return {
    name: 'NoMatchingCEP',
    message: 'There is no CEP matching',
  };
}

export function noEnrollmentFound(): ApplicationError {
  return {
    name: 'NoEnrollmentFound',
    message: 'There is no Enrollment for this ticket',
  };
}

export function noHotelsFoundError(): ApplicationError {
  return {
    name: 'NoHotelsFoundError',
    message: 'There is no hotel registred',
  };
}
