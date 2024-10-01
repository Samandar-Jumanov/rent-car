import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { CreateCarRequest, UpdateCarRequest, CreateRentalRequest, ICar, IRental } from "./carsModel";
import { JwtPayload } from "jsonwebtoken";

export class CarService {
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
      }

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
        }
      });

      return ServiceResponse.success<IRental | null>("Order created successfully", newRental as IRental, StatusCodes.CREATED);
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
      const cancelled = await prisma.rental.delete({
        where: { id: rentalId }
      });
      return ServiceResponse.success<IRental | null>("Order cancelled", cancelled as IRental, StatusCodes.OK);
    } catch (ex) {
      return ServiceResponse.failure("An error occurred while cancelling order.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async addCar(data: CreateCarRequest, brandId: string, userId: string): Promise<ServiceResponse<ICar | null>> {
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

      const car = await prisma.car.create({
        data: {
          ...data,
          brendId: brandId,  
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
      const deletedCar = await prisma.car.delete({
        where: { id: carId },
      });

      return ServiceResponse.success("Car deleted successfully", deletedCar as ICar, StatusCodes.OK);
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