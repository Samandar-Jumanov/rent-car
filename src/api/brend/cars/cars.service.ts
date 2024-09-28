import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { CreateRentalRequest,  IRental } from "./carsModel";
import { JwtPayload } from "jsonwebtoken";

export class CarService {
  async orderBrendCar( brendId : string  , carId : string , body : CreateRentalRequest  , user : JwtPayload ): Promise<ServiceResponse<IRental | null>> {
    try {

      const brend = await prisma.brand.findUnique({
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
             brand : true,
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

      const { requirements  , ...rest } = body
      const reqArray = Array.isArray(requirements) ? requirements : (requirements as any ).split(",")
     


      const newRental = await prisma.rental.create({
             data : {
              ...rest,
              requirements: {
                connect: reqArray.map(( reqId : string ) => ({ id: reqId }))
              },
              user: { connect: { id: existingUser.id } },
              car: { connect: { id: carId } },
             }
      });


      
    


      return ServiceResponse.success<IRental | null >("Order created succesfully", newRental  as IRental, StatusCodes.CREATED );
      
    } catch (ex) {
        logger.error(`Error creating order: ${(ex as Error).message}`);
      return ServiceResponse.failure(
        "An error occurred while creating an order",
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

     return ServiceResponse.success<IRental | null >("Order cancelled", cancelled  as IRental , StatusCodes.OK);
    } catch (ex) {
      return ServiceResponse.failure("An error occurred while cancelling order.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};


export const carService = new CarService();