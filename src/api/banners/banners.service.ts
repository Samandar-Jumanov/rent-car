
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { IBanners, CreateBannersRequest, UpdateBannersRequest } from "./banners.model";

export class BannersService {
  async findAll() : Promise<ServiceResponse< IBanners[] | null >> {
    try {
     const banners = await prisma.banners.findMany()
      return ServiceResponse.success(
        "Banners found",
          banners 
      );
    } catch (ex) {
      const errorMessage = `Error finding all banners: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving banners.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBanners ( currentPage : number , pageSize : number ) : Promise<ServiceResponse<{ banners :  IBanners[]  , totalCount : number } | null >> {
    try {

      const skip = (currentPage - 1) * pageSize;

      const [banners, totalCount] = await prisma.$transaction([
        prisma.banners.findMany({
          skip,
          take: pageSize,
          include: {
             car : true 
          },
          orderBy: {
            createdAt: 'desc' 
          }
        }),

        prisma.brand.count()
      ]);

      return ServiceResponse.success<{ banners: IBanners[], totalCount: number }>(
        "Banners  found",
        { 
          banners: banners, 
          totalCount  : banners.length
        }
      );
      
  }catch( ex ) {
    const errorMessage = `Error finding all banners : ${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure(
      "An error occurred while retrieving users.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
  }

  async findBanner(id: string): Promise<ServiceResponse<IBanners | null>> {
    try {
      const banner = await prisma.banners.findUnique({ where: { id } });
      if (!banner) {
        return ServiceResponse.failure("Banner not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IBanners>("Banner found", banner as IBanners);
    } catch (ex) {
      const errorMessage = `Error finding banner with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding banner.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createBanner(data: CreateBannersRequest , carId : string ): Promise<ServiceResponse<IBanners | null>> {
    try {
      const banner = await prisma.banners.create({ data : {
             ...data , carId
      } });

      return ServiceResponse.success<IBanners>("Banner created successfully", banner as IBanners);
    } catch (ex) {
      const errorMessage = `Error creating banner: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the banner.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBanner(id: string, data: UpdateBannersRequest): Promise<ServiceResponse<IBanners | null>> {
    try {
      const banner = await prisma.banners.update({
        where: { id },
        data,
      });
      return ServiceResponse.success<IBanners>("Banner updated successfully", banner as IBanners);
    } catch (ex) {
      const errorMessage = `Error updating banner: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating the banner.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteBanner(id: string): Promise<ServiceResponse<boolean>> {
    try {
      await prisma.banners.delete({ where: { id } });
      return ServiceResponse.success("Banner deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting banner: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the banner.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const bannersService = new BannersService();