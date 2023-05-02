import joi from 'joi';
import { TicketParams } from '@/services/tickets-service';

export const ticketSchema = joi.object<TicketParams>({
  ticketTypeId: joi.number().integer().min(1).required(),
});
