import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { ICarColor, CreateCarColorRequest } from "./colors.model";

export class CarColorService {
  async createCarColor(data: CreateCarColorRequest): Promise<ServiceResponse<ICarColor | null>> {
    try {

      const existing = await prisma.carColor.findUnique({
        where : {
            color : data.color
        }
      })
      
      if(existing) {
           return ServiceResponse.failure("Color  with this name already exists", null , StatusCodes.BAD_REQUEST);
       }
 

      const carColor = await prisma.carColor.create({
        data: {
          ...data,
        },
      });
      

      return ServiceResponse.success<ICarColor>("Car color created successfully", carColor);
    } catch (ex) {
      const errorMessage = `Error creating car color: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the car color.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateColor( id : string , data: CreateCarColorRequest): Promise<ServiceResponse<ICarColor | null>> {
    try {

      const existing = await prisma.carColor.findUnique({
        where : {
              id
        }
      })
      
      if(!existing) {
           return ServiceResponse.failure("Color not found ", null , StatusCodes.NOT_FOUND);
       }

      const carColor = await prisma.carColor.update({
        data: {
          ...data,
        },
        where : { id }
      });
      

      return ServiceResponse.success<ICarColor>("Car color updated successfully", carColor);
    } catch (ex) {
      const errorMessage = `Error creating car color: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating  the car color.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async deleteCarColor(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const existing = await prisma.carColor.findUnique({
        where : {
            id
        }
      })
      
      
      if(!existing) {
           return ServiceResponse.failure("Color not found", false , StatusCodes.NOT_FOUND);
       }

      await prisma.carColor.delete({ where: { id } });
      return ServiceResponse.success("Car color deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting car color: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the car color.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findCarColor(id: string): Promise<ServiceResponse<ICarColor | null>> {
    try {
      const carColor = await prisma.carColor.findUnique({ 
        where: { id },
        include: {
          cars: true
        }
      });
      
      if (!carColor) {
        return ServiceResponse.failure("Car color not found", null, StatusCodes.NOT_FOUND);
      }
      
      return ServiceResponse.success<ICarColor>("Car color found", carColor as ICarColor);
    } catch (ex) {
      const errorMessage = `Error finding car color: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding the car color.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllCarColors(currentPage : number , pageSize : number ): Promise<ServiceResponse<{ carColors : ICarColor[] , totalCount : number  } | null >> {
    try {
      const skip = (currentPage - 1) * pageSize;
  
      const [carColors, totalCount] = await prisma.$transaction([
        prisma.carColor.findMany({
          skip,
          take: pageSize,
          include: {
              cars : true
          },
          orderBy: {
            createdAt: 'desc' 
          }
        }),
        prisma.carColor.count()
      ]);
  
      return ServiceResponse.success<{ carColors: ICarColor[], totalCount: number }>(
        "Colors  found",
        { 
          carColors: carColors as ICarColor[], 
          totalCount 
        }
      );
    
    } catch (ex) {
      const errorMessage = `Error finding car colors: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding car colors.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const carColorService = new CarColorService();