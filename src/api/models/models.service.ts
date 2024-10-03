import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { IModel, CreateModelRequest } from "./models.model";

export class ModelService {
  async createModel(data: CreateModelRequest): Promise<ServiceResponse<IModel | null>> {
    try {
      const model = await prisma.model.create({
        data: {
          ...data,
        },
      });
      
      return ServiceResponse.success<IModel>("Model created successfully", model);
    } catch (ex) {
      const errorMessage = `Error creating model: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the model.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteModel(id: string): Promise<ServiceResponse<boolean>> {
    try {
      await prisma.model.delete({ where: { id } });
      return ServiceResponse.success("Model deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting model: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the model.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findModel(id: string): Promise<ServiceResponse<IModel | null>> {
    try {
      const model = await prisma.model.findUnique({ 
        where: { id },
        include: {
          cars: true
        }
      });
      
      if (!model) {
        return ServiceResponse.failure("Model not found", null, StatusCodes.NOT_FOUND);
      }
      
      return ServiceResponse.success<IModel>("Model found", model as IModel);
    } catch (ex) {
      const errorMessage = `Error finding model: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding the model.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllModels(): Promise<ServiceResponse<IModel[] | null>> {
    try {
      const models = await prisma.model.findMany({
        include: {
          cars: true
        }
      });
      
      return ServiceResponse.success<IModel[]>(
        "Models retrieved successfully",
        models
      );
    } catch (ex) {
      const errorMessage = `Error finding models: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding models.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const modelService = new ModelService();