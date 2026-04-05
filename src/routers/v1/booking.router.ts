import express from 'express';
import {  confirmBookingController, createBookingController } from '../../controllers/booking.controller';
import { validateRequestBody } from '../../validators';
import { createBookingSchema } from '../../validators/booking.validator';

const bookingRouter = express.Router();

bookingRouter.post('/', validateRequestBody(createBookingSchema), createBookingController); // TODO: Resolve this TS compilation issue

bookingRouter.post('/confirm/:idempotencyKey', confirmBookingController); // TODO: Resolve this TS compilation issue

export default bookingRouter;