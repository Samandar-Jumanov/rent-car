import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { ICarBrend, CreateCarBrendRequest } from "./car-brend.model";
import { ICar } from "../brend/cars/carsModel";

export class CarBrendService {
  async createCarBrend(data: CreateCarBrendRequest): Promise<ServiceResponse<ICarBrend | null>> {
    try {

        const existing = await prisma.carBrend.findUnique({
               where : {
                   carBrend : data.carBrend
               }
        })
        if(existing) {
            return ServiceResponse.failure("Car brend with this name already exists", null , StatusCodes.BAD_REQUEST);
        }
        
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
        const existing = await prisma.carBrend.findUnique({
            where : {
                id
            }
     })

     if(!existing) {
         return ServiceResponse.failure("Car brend with this name already exists", false , StatusCodes.NOT_FOUND);
     }

      await prisma.carBrend.delete({ where: { id } });
      return ServiceResponse.success("Car brand deleted successfully", true , StatusCodes.OK);
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

     
  async findAllCarBrends( currentPage : number , pageSize : number ): Promise<ServiceResponse<{ carBrands : ICarBrend[] , totalCount : number  } | null >> {
    try {
      const skip = (currentPage - 1) * pageSize;
  
      const [carBrands, totalCount] = await prisma.$transaction([
        prisma.carBrend.findMany({
          skip,
          take: pageSize,
          include: {
              cars : true
          },
          orderBy: {
            createdAt: 'desc' 
          }
        }),
        prisma.carBrend.count()
      ]);
  
      return ServiceResponse.success<{ carBrands: ICarBrend[], totalCount: number }>(
        "Banners found",
        { 
          carBrands: carBrands as ICarBrend[], 
          totalCount 
        }
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


  async updateCarBrend (  id : string , data : { brandName : string} ): Promise<ServiceResponse<ICarBrend | null>> {
    try {

      const carBrand  = await prisma.carBrend.findUnique({
          where : {
              id : id 
          }
      });
      if(!carBrand) {
          return ServiceResponse.failure("Car brend not found", null , StatusCodes.NOT_FOUND);
      }
      const updatedCarBrand = await prisma.carBrend.update({
          where : { id },
          data : {
           carBrend : data.brandName
          }
      })
      return ServiceResponse.success("Car brend updated ", updatedCarBrand  as ICarBrend, StatusCodes.OK);
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