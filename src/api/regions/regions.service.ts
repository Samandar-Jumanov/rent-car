import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { IRegion, ICity, CreateRegionRequest, CreateCityRequest } from "./regions.model";

export class RegionService {
  async createRegion(data: CreateRegionRequest): Promise<ServiceResponse<IRegion | null>> {
    try {
      const existing = await prisma.regions.findUnique({
        where: { name: data.name }
      });

      if (existing) {
        return ServiceResponse.failure("Region with this name already exists", null, StatusCodes.BAD_REQUEST);
      }

      const region = await prisma.regions.create({
        data: {
          ...data,
        },
        include: { cities: true },
      });

      return ServiceResponse.success<IRegion>("Region created successfully", region);
    } catch (ex) {
      const errorMessage = `Error creating region: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the region.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteRegion(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const existing = await prisma.regions.findUnique({
        where: { id }
      });

      if (!existing) {
        return ServiceResponse.failure("Region not found", false, StatusCodes.NOT_FOUND);
      }

      await prisma.regions.delete({ where: { id } });
      return ServiceResponse.success("Region deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting region: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the region.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findRegion(id: string) : Promise<ServiceResponse<IRegion | null>> {
    try {
      const region = await prisma.regions.findUnique({
        where: { id },
        include: { cities: true }
      });

      if (!region) {
        return ServiceResponse.failure("Region not found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<IRegion>("Region found", region);
    } catch (ex) {
      const errorMessage = `Error finding region: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding the region.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllRegions(currentPage : number  , pageSize : number  ): Promise<ServiceResponse<{ regions: IRegion[], totalCount: number } | null>> {
    try {
      const skip = (currentPage - 1) * pageSize;

      const [regions, totalCount] = await prisma.$transaction([
        prisma.regions.findMany({
          skip,
          take: pageSize,
          include: {
               cities : true 
            },
        }),
        prisma.regions.count()
      ]);

      return ServiceResponse.success<{ regions : IRegion[], totalCount: number }>(
        "Models found",
        { 
          regions: regions, 
          totalCount 
        }
      );
    } catch (ex) {
      const errorMessage = `Error finding regions: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding regions.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllRegions ( )  : Promise<ServiceResponse<IRegion[] | null>>  {  
    try {
      const regions = await prisma.regions.findMany({
        include: {
          cities: true
        },
      });
      return ServiceResponse.success(
        "Regions found",
         regions
      );
      
    } catch (ex) {
      const errorMessage = `Error finding regions: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.success(
        "Regions found",
         null
      );
    }
  }
  
 }


export const  regionService = new RegionService()