import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { ICollaboratedCars, CreateCollaboratedCarsRequest, UpdateCollaboratedCarsRequest } from "./colloborate.model";

export class CollaboratedCarsService {
  async findAll(): Promise<ServiceResponse<ICollaboratedCars[] | null>> {
    try {
      const collaboratedCars = await prisma.collaboratedCars.findMany();
      return ServiceResponse.success<ICollaboratedCars[]>("Collaborated cars found", collaboratedCars as ICollaboratedCars[]);
    } catch (ex) {
      const errorMessage = `Error finding all collaborated cars: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving collaborated cars.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findCollaboratedCar(id: string): Promise<ServiceResponse<ICollaboratedCars | null>> {
    try {
      const collaboratedCar = await prisma.collaboratedCars.findUnique({ where: { id } });
      if (!collaboratedCar) {
        return ServiceResponse.failure("Collaborated car not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<ICollaboratedCars>("Collaborated car found", collaboratedCar as ICollaboratedCars);
    } catch (ex) {
      const errorMessage = `Error finding collaborated car with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding collaborated car.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createCollaboratedCar(data: CreateCollaboratedCarsRequest, agentId: string): Promise<ServiceResponse<ICollaboratedCars | null>> {
    try {
      const collaboratedCar = await prisma.collaboratedCars.create({ 
        data: {
          ...data,
          agentId
        }
      });
      return ServiceResponse.success<ICollaboratedCars>("Collaborated car created successfully", collaboratedCar as ICollaboratedCars);
    } catch (ex) {
      const errorMessage = `Error creating collaborated car: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the collaborated car.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCollaboratedCar(id: string, data: UpdateCollaboratedCarsRequest): Promise<ServiceResponse<ICollaboratedCars | null>> {
    try {
      const collaboratedCar = await prisma.collaboratedCars.update({
        where: { id },
        data,
      });
      return ServiceResponse.success<ICollaboratedCars>("Collaborated car updated successfully", collaboratedCar as ICollaboratedCars);
    } catch (ex) {
      const errorMessage = `Error updating collaborated car: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating the collaborated car.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCollaboratedCar(id: string): Promise<ServiceResponse<boolean>> {
    try {
      await prisma.collaboratedCars.delete({ where: { id } });
      return ServiceResponse.success("Collaborated car deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting collaborated car: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the collaborated car.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const collaboratedCarsService = new CollaboratedCarsService();