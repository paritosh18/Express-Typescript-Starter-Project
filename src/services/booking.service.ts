import { CreateBookingDto } from '../dto/booking.dto';
import {confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempontencyKey} from '../repositories/booking.repositories'
import { NotFoundError } from '../utils/errors/app.error';
import { generateIdempotencyKey } from '../utils/helpers/generateIdempotency'

  
export async function createBookingService(createBookingDTO:CreateBookingDto){
    const booking = await createBooking({
        userId: createBookingDTO.userId,
        hotelId: createBookingDTO.hotelId,
        totalGuests: createBookingDTO.totalGuests,
        bookingAmount: createBookingDTO.bookingAmount
    })

    const idempotencyKey = generateIdempotencyKey();

    await createIdempotencyKey(idempotencyKey, booking.id)

    return {
        bookingId: booking.id,
        idempotencyKey: idempotencyKey
    }
    
}
export async function confirmBookingService(idempotencyKey:string){  
     
    const idempotencyKeyRecord = await getIdempontencyKey(idempotencyKey);

    if(!idempotencyKeyRecord){
        throw new NotFoundError("No idempotency key found");
    }

    if(idempotencyKeyRecord.finalized){
        throw new NotFoundError("Booking already finalized");
    }

    if(!idempotencyKeyRecord.bookingId){
        throw new NotFoundError("No booking id found");
    }

    //payment processing logic can be added here
    const booking = await confirmBooking(idempotencyKeyRecord.bookingId);

    await finalizeIdempotencyKey(idempotencyKey);

    return booking;
}                             
