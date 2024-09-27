import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { IBrend , QueryBrend  } from "./brendModel";
import { ITopBrend } from "./topBrend/topBrendModel";


type QueryBrendResult = {
  data: Omit<IBrend, 'password'>[];
  count: number;
};


export class BrendService {
  async getBrends(): Promise<ServiceResponse<IBrend[] | null>> {
    try {

      const brends = await prisma.brand.findMany( {
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
      const brend = await prisma.brand.findUnique({
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
  async  queryBrends(query: QueryBrend): Promise<ServiceResponse<QueryBrendResult | null >> {
    try {
      const brends = await prisma.brand.findMany({
        where: {
          address: query.address ? { contains: query.address, mode: 'insensitive' } : undefined,
          payment: query.payment,
          carDelivery: query.carDelivery,
          cars: {
            some: {
              carBrend: query.carBrend ? { contains: query.carBrend, mode: 'insensitive' } : undefined,
              color: query.color ? { contains: query.color, mode: 'insensitive' } : undefined,
            },
          },
        },
        include: {
          cars: true
        },
      });
      const brendsWithoutPassword = brends.map(({ password, ...rest }) => rest);
      const count = brends.length;
      return ServiceResponse.success(
        count > 0 ? "Brends queried successfully" : "No brends found that match the given criteria", 
        { data: brendsWithoutPassword, count }
      );
      
    } catch (error) {
      const errorMessage = `Error querying brends`;
      logger.error(errorMessage, error);
      return ServiceResponse.failure("An error occurred while querying brends.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}


export const brendService = new BrendService();