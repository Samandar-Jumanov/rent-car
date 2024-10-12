import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { IModel, CreateModelRequest } from "./models.model";


export class ModelService {
  async createModel(data: CreateModelRequest): Promise<ServiceResponse<IModel | null>> {
    try {

        const existing = await prisma.model.findUnique({
            where : {
                modelName : data.modelName
            }
          })
    
          if(existing) {
               return ServiceResponse.failure("Color  with this name already exists", null , StatusCodes.BAD_REQUEST);
           }
           
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

  async updateModel( id : string , data: CreateModelRequest): Promise<ServiceResponse<IModel | null>> {
    try {

      logger.info({ id , data  })

        const existing = await prisma.model.findUnique({
            where : {
                id 
            }
          })
    
          if(!existing) {
               return ServiceResponse.failure("Model not found", null , StatusCodes.BAD_REQUEST);
           }
           
      const newModel = await prisma.model.update({
        data: {
          ...data,
        },
        where : { id }
      });
      
      return ServiceResponse.success<IModel>("Model updated successfully", newModel);
    } catch (ex) {
      const errorMessage = `Error updating model: ${(ex as Error).message}`;
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
        const existing = await prisma.model.findUnique({
            where : {
                id
            }
          })
    
          if(!existing) {
               return ServiceResponse.failure("Model not found", false , StatusCodes.NOT_FOUND);
           }

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

  async findAllModels( currentPage : number , pageSize : number ): Promise<ServiceResponse<{ models: IModel[], totalCount: number } | null>>{
    try {
      const skip = (currentPage - 1) * pageSize;

      const [models, totalCount] = await prisma.$transaction([
        prisma.model.findMany({
          skip,
          take: pageSize,
          include: {
               cars : true 
            },
        }),

        prisma.model.count()
      ]);

      return ServiceResponse.success<{ models: IModel[], totalCount: number }>(
        "Models found",
        { 
          models: models, 
          totalCount 
        }
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