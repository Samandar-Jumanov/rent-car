import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { CreateRentalRequest,  IRental } from "./carsModel";
import { JwtPayload } from "jsonwebtoken";

export class CarService {
  async orderBrendCar( brendId : string  , carId : string , body : CreateRentalRequest  , user : JwtPayload ): Promise<ServiceResponse<IRental | null>> {
    try {

      const brend = await prisma.brend.findUnique({
          where : {
              id : brendId
          }
      })

      if(!brend) {
          return ServiceResponse.failure("Brend not found", null, StatusCodes.NOT_FOUND);
      }

      const car = await prisma.car.findUnique({
          where : { id : carId},
          include : {
             brend : true,
             images : true
          }
      });


      if(!car) {
         return ServiceResponse.failure("Car not found", null, StatusCodes.NOT_FOUND);
      };


      const existingUser = await prisma.user.findUnique({
         where : { phoneNumber : user.phoneNumber}
      })


      if(!existingUser) {
        return ServiceResponse.failure("User  not found", null, StatusCodes.NOT_FOUND);
      }

      const newRental = await prisma.rental.create({
             data : {
                     ...body, 
                     userId : existingUser.id ,
                     carId
             }
      });


      return ServiceResponse.success<IRental | null >("Order created succesfully", newRental , StatusCodes.CREATED );
      
    } catch (ex) {
        logger.error(`Error creating order: ${(ex as Error).message}`);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

  }

  async cancelOrder( rentalId : string ): Promise<ServiceResponse<IRental | null>> {
    try {

     const cancelled =  await prisma.rental.delete({
         where : { id : rentalId}
      })

     return ServiceResponse.success<IRental | null >("Order cancelled", cancelled  , StatusCodes.OK);
    } catch (ex) {
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};


export const carService = new CarService();