import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { ICarBrend, CreateCarBrendRequest } from "./car-brend.model";

export class CarBrendService {
  async createCarBrend(data: CreateCarBrendRequest): Promise<ServiceResponse<ICarBrend | null>> {
    try {
      const carBrend = await prisma.carBrend.create({
        data: {
          ...data,
        },
      });
      
      return ServiceResponse.success<ICarBrend>("Car brand created successfully", carBrend as ICarBrend);
    } catch (ex) {
      const errorMessage = `Error creating car brand: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the car brand.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCarBrend(id: string): Promise<ServiceResponse<boolean>> {
    try {
      await prisma.carBrend.delete({ where: { id } });
      return ServiceResponse.success("Car brand deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting car brand: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the car brand.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findCarBrend(id: string): Promise<ServiceResponse<ICarBrend | null>> {
    try {
      const carBrend = await prisma.carBrend.findUnique({ 
        where: { id },
        include: {
          cars: true
        }
      });
      
      if (!carBrend) {
        return ServiceResponse.failure("Car brand not found", null, StatusCodes.NOT_FOUND);
      }
      
      return ServiceResponse.success<ICarBrend>("Car brand found", carBrend as ICarBrend);
    } catch (ex) {
      const errorMessage = `Error finding car brand: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding the car brand.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllCarBrends(): Promise<ServiceResponse<ICarBrend[] | null>> {
    try {
      const carBrends = await prisma.carBrend.findMany({
        include: {
          cars: true
        }
      });
      
      return ServiceResponse.success<ICarBrend[]>(
        "Car brands retrieved successfully",
        carBrends
      );
    } catch (ex) {
      const errorMessage = `Error finding car brands: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding car brands.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const carBrendService = new CarBrendService();