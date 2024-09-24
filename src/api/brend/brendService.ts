import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { IBrend } from "./brendModel";
import { ITopBrend } from "./topBrend/topBrendModel";

export class BrendService {
  async getBrends(): Promise<ServiceResponse<IBrend[] | null>> {
    try {

      const brends = await prisma.brend.findMany( {
          include : {
             cars : {
                  include : {
                         rentals :true
                  }
             }
          }
      });
      
      return ServiceResponse.success<IBrend[] | null >("Brends found", brends );
    } catch (ex) {
      const errorMessage = `Error finding all users: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTopBrends(): Promise<ServiceResponse<ITopBrend[] | null>> {
    try {

       const topBrends = await prisma.topBrend.findMany({
              include : {
                     brend : true 
              }
        })

     return ServiceResponse.success<ITopBrend[] | null >("Brends found", topBrends );
    
    } catch (ex) {
      const errorMessage = `Error finding top brends ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }


  async getBrendById(brendId: string): Promise<ServiceResponse<IBrend | null>> {
    try {
      const brend = await prisma.brend.findUnique({
        where: { id: brendId },
        include : {
             cars : {
                  include : {
                         rentals :true
                  }
             }
        }
      });
      
      if (!brend) {
        return ServiceResponse.failure("Brend not found", null, StatusCodes.NOT_FOUND);
      }
      
      return ServiceResponse.success<IBrend>("Brend found", brend);
    } catch (ex) {
      const errorMessage = `Error finding brend with id ${brendId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding brend.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};


export const brendService = new BrendService();