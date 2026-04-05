import { Request,Response } from "express";
import { confirmBookingService,createBookingService } from "../services/booking.service";


export async function createBookingController(req:Request,res:Response){
    const booking = await createBookingService(req.body);     
    res.status(201).json({
        message: "Booking created successfully",
        booking
    })      
}

export async function confirmBookingController(req:Request,res:Response){
    const booking = await confirmBookingService(req.params.idempotencyKey);   
    res.status(200).json({
        message: "Booking finalized successfully",
        booking
    })      
}