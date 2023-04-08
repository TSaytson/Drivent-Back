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
