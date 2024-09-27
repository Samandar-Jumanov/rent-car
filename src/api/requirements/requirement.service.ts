import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { IRequirements, CreateRequirementsRequest, UpdateRequirementsRequest, ApplyRequirement } from "./requirement.model";

export class RequirementsService {
  async findAll(): Promise<ServiceResponse<IRequirements[] | null>> {
    try {
      const requirements = await prisma.requirements.findMany();
      return ServiceResponse.success<IRequirements[]>("Requirements found", requirements as IRequirements[]);
    } catch (ex) {
      const errorMessage = `Error finding all requirements: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving requirements.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findRequirements(id: string): Promise<ServiceResponse<IRequirements | null>> {
    try {
      const requirements = await prisma.requirements.findUnique({ where: { id } });
      if (!requirements) {
        return ServiceResponse.failure("Requirements not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IRequirements>("Requirements found", requirements as IRequirements);
    } catch (ex) {
      const errorMessage = `Error finding requirements with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding requirements.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createRequirements(data: CreateRequirementsRequest): Promise<ServiceResponse<IRequirements | null>> {
    try {
      const requirements = await prisma.requirements.create({ data });
      return ServiceResponse.success<IRequirements>("Requirements created successfully", requirements as IRequirements);
    } catch (ex) {
      const errorMessage = `Error creating requirements: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the requirements.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateRequirements(id: string, data: UpdateRequirementsRequest): Promise<ServiceResponse<IRequirements | null>> {
    try {
      const requirements = await prisma.requirements.update({
        where: { id },
        data,
      });
      return ServiceResponse.success<IRequirements>("Requirements updated successfully", requirements as IRequirements);
    } catch (ex) {
      const errorMessage = `Error updating requirements: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating the requirements.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async applyRequirements(data: ApplyRequirement): Promise<ServiceResponse<IRequirements[] | null>> {
    try {
      const updatedRequirements = await prisma.$transaction(
        data.requirementsId.map(reqId =>
          prisma.requirements.update({
            where: { id: reqId },
            data: { carId: data.carId }
          })
        )
      );

      return ServiceResponse.success<IRequirements[]>(
        "Requirements applied successfully",
        updatedRequirements as IRequirements[]
      );
      
    } catch (ex) {
      const errorMessage = `Error applying requirements: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while applying requirements.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteRequirements(id: string): Promise<ServiceResponse<boolean>> {
    try {
      await prisma.requirements.delete({ where: { id } });
      return ServiceResponse.success("Requirements deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting requirements: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the requirements.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const requirementsService = new RequirementsService();