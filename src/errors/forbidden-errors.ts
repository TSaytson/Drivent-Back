import { ApplicationError } from '@/protocols';

export function maximumCapacityError(): ApplicationError {
  return {
    name: 'MaximumCapacityError',
    message: 'Maximum capacity reached for this room',
  };
}
