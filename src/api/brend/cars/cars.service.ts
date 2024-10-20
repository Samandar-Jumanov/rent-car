import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { CreateCarRequest, UpdateCarRequest, CreateRentalRequest, ICar, IRental } from "./carsModel";
import { JwtPayload } from "jsonwebtoken";
import { deleteFile } from "@/api/supabase/storage";

export class CarService {


  // here liked cars on users 

  async getAllCars ( ) {
    try {
      const cars = await prisma.car.findMany({
         include :  {
            rentals : true ,
            banners : true ,
            brand : true ,
            discounts : true ,
            reviews : true ,
            model : true ,
            carBrend : true, 
            carColor : true
         }
      });

      return ServiceResponse.success("Cars found", cars);
    } catch (ex) {
      const errorMessage = `Error finding all cars : ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving cars.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
    }

  async orderBrendCar(
    brandId: string,
    carId: string,
    body: CreateRentalRequest,
    user: JwtPayload
  ): Promise<ServiceResponse<IRental | null>> {
    try {
      const brand = await prisma.brand.findUnique({
        where: { id: brandId }
      });

      if (!brand) {
        return ServiceResponse.failure("Brand not found", null, StatusCodes.NOT_FOUND);
      }

      const car = await prisma.car.findUnique({
        where: { id: carId },
        include: { brand: true }
      });

      if (!car) {
        return ServiceResponse.failure("Car not found", null, StatusCodes.NOT_FOUND);
      };



      const existingUser = await prisma.user.findUnique({
        where: { phoneNumber: user.phoneNumber }
      });

      if (!existingUser) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      const { requirements, ...rest } = body;
      const reqArray = Array.isArray(requirements) ? requirements : (requirements as any).split(",");

      const newRental = await prisma.rental.create({
        data: {
          ...rest,
          requirements: {
            connect: reqArray.map((reqId: string) => ({ id: reqId }))
          },
          user: { connect: { id: existingUser.id } },
          car: { connect: { id: carId } },
          brand : { connect : { id: brandId }}
        }
      });

      return ServiceResponse.success<IRental | null>("Order created successfully", newRental as any , StatusCodes.CREATED); //  TO DO should be changed later to correct type
    } catch (ex) {
      logger.error(`Error creating order: ${(ex as Error).message}`);
      return ServiceResponse.failure(
        "An error occurred while creating an order",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelOrder(rentalId: string): Promise<ServiceResponse<IRental | null>> {
    try {
      const rental = await prisma.rental.findUnique({
        where: { id: rentalId },
      });


      if(!rental) {
         return ServiceResponse.failure("Could not find rental", null, StatusCodes.NOT_FOUND);
      }

      await prisma.rental.delete({
           where : { id: rentalId},
      })

      const driversLicanceImages  = rental.driverLicenceImages
      const passportImages  = rental.passportImages

      // delete images here using cloudinary or any other storage service

      for ( const  each of driversLicanceImages) {
             await deleteFile(String(each.split("/").pop()))
      }

      for ( const  each of passportImages) {
        await deleteFile(String(each.split("/").pop()))
       }

      return ServiceResponse.success("Order cancelled", rental as any , StatusCodes.OK);
    } catch (ex) {
      return ServiceResponse.failure("An error occurred while cancelling order.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async addCar(data: any   , brandId  : string ,  userId: string): Promise<ServiceResponse<ICar | null>> {
    try {
      const brand = await prisma.brand.findUnique({
        where: { id: brandId }
      });


      if (!brand) {
        return ServiceResponse.failure("Brand not found", null, StatusCodes.NOT_FOUND);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      logger.info({ data })

      const car = await prisma.car.create({
        data: {
          ...data,
          brendId : brand.id
        }
      });

      return ServiceResponse.success("Car created successfully", car as ICar, StatusCodes.CREATED);
      
    } catch (ex) {
      logger.error(`Error creating car: ${(ex as Error).message}`);
      return ServiceResponse.failure(
        "An error occurred while creating a car",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async updateCar(carId: string, data: UpdateCarRequest): Promise<ServiceResponse<ICar | null>> {
    try {
      const updatedCar = await prisma.car.update({
        where: { id: carId },
        data: data,
      });

      return ServiceResponse.success("Car updated successfully", updatedCar as ICar, StatusCodes.OK);
    } catch (ex) {
      logger.error(`Error updating car: ${(ex as Error).message}`);
      return ServiceResponse.failure(
        "An error occurred while updating the car",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCar(carId: string): Promise<ServiceResponse<ICar | null>> {
    try {
      const car = await prisma.car.findUnique({
        where: { id: carId },
      });

      if(!car) {
        return ServiceResponse.failure(
          "Could not find car find",
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      const carImages = car.images

      await prisma.car.delete({ where : { id : carId}})

      for( const each of carImages) {
           await deleteFile(String(each.split("/").pop())) // delete file fro storage 
      }

      return ServiceResponse.success("Car deleted successfully", car as ICar, StatusCodes.OK);
    } catch (ex) {
      logger.error(`Error deleting car: ${(ex as Error).message}`);
      return ServiceResponse.failure(
        "An error occurred while deleting the car",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOneCar(carId: string): Promise<ServiceResponse<ICar | null>> {
    try {
      const car = await prisma.car.findUnique({
        where: { id: carId },
        include: {
          brand: true,
          model: true,
          carColor: true,
          carBrend: true,
        },
      });

      if (!car) {
        return ServiceResponse.failure("Car not found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success("Car retrieved successfully", car as ICar, StatusCodes.OK);
    } catch (ex) {
      logger.error(`Error retrieving car: ${(ex as Error).message}`);
      return ServiceResponse.failure(
        "An error occurred while retrieving the car",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const carService = new CarService();