import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { CreateReviewRequest, IBrend , IReviewSchema, QueryBrend , CreateBrendRequest, UpdateBrendRequest   } from "./brendModel";
import { ITopBrend } from "./topBrend/topBrendModel";
import bcrypt from "bcrypt"

type QueryBrendResult = {
  data: Omit<IBrend, 'password'>[];
  count: number;
};


export class BrendService {
  async getBrends( regionId : string  ): Promise<ServiceResponse<IBrend[] | null>> {
    try {
      const brends = await prisma.brand.findMany({
          include : {
                cars : true,
                city : true ,
                discounts : true ,
                reviews : true
          },
          where : {
               city : {
                 regionId 
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

  async getAllBrends (currentPage : number , pageSize : number  ) :Promise<ServiceResponse<{ brands: IBrend[], totalCount: number } | null>> {
    try {

      const skip = (currentPage - 1) * pageSize;

      const [brends, totalCount] = await prisma.$transaction([
        prisma.brand.findMany({
          skip,
          take: pageSize,
          include: {
            city: {
              include : {
                  region : true 
              }
            },
            cars: true,
            reviews: true,
          },
          orderBy: {
            createdAt: 'desc' 
          }
        }),

        prisma.brand.count()
      ]);

      return ServiceResponse.success<{ brands: IBrend[], totalCount: number }>(
        "Brands found",
        { 
          brands: brends, 
          totalCount 
        }
      );

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

 async getTopBrends(regionId: string): Promise<ServiceResponse<ITopBrend[] | null >> {
  try {
    const topBrends = await prisma.topBrend.findMany({
      where: {
        brend: {
          city: {
            regionId: regionId
          }
        }
      },
      include: {
        brend: {
          include: {
            cars: {
              include: {
                rentals: true
              }
            }
          }
        }
      }
    });

    return ServiceResponse.success<ITopBrend[]>("Top brands found", topBrends);
  } catch (ex) {
    const errorMessage = `Error finding top brands: ${(ex as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while finding top brands.", null, StatusCodes.INTERNAL_SERVER_ERROR);
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
             },
             reviews : true ,
             colloboratedCars : true ,
             city : true 
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
  async queryBrends(query: QueryBrend): Promise<ServiceResponse<QueryBrendResult | null>> {
    try {
      const brends = await prisma.brand.findMany({
        where: {
          cityId: query.cityId ? { contains: query.cityId, mode: 'insensitive' } : undefined,
          payment: query.payment,
          carDelivery: query.carDelivery,
          cars: {
            some: {
              carBrend: query.carBrend ? {
                carBrend: { contains: query.carBrend, mode: 'insensitive' }
              } : undefined,
              carColor: query.color ? {
                color: { contains: query.color, mode: 'insensitive' }
              } : undefined,
              status: "FREE",
              price: {
                gte: query.minPrice ? parseFloat(query.minPrice) : undefined,
                lte: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
              },
              requirements: query.requirements ? {
                some: {
                  title: { in: query.requirements }
                }
              } : undefined,
              features: query.features ? {
                some: {
                  title: { in: query.features }
                }
              } : undefined,
            },
          },
        },
        include: {
          cars: {
            where: {
              status: "FREE",
            },
            include: {
              requirements: true,
              features: true,
              discounts: true,
              carBrend: true,
              carColor: true,
              model: true
            }
          }
        },
      });
      
      const brendsWithoutPassword = brends.map(({ password, ...rest }) => rest);
      const count = brends.length;
      return ServiceResponse.success(
        count > 0 ? "Brands queried successfully" : "No brands found that match the given criteria", 
        { data: brendsWithoutPassword, count }
      );
      
    } catch (error) {
      const errorMessage = `Error querying brands`;
      logger.error(errorMessage, error);
      return ServiceResponse.failure("An error occurred while querying brands.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async addReview ( data : CreateReviewRequest , userId : string ) : Promise<ServiceResponse<IReviewSchema | null >> {
    try {

      if(data.carId) {
           const car = await prisma.car.findUnique({
               where : { id : data.carId}
           });


           if(!car) {
                  return ServiceResponse.failure("Car not found", null, StatusCodes.NOT_FOUND);
           };

           // ret current ratings
           // add the req rating 
           // calculate the new average rating
           // update the car table with the new average rating


           const currentRatings = car.ratings;
           currentRatings.push(data.rating);
           const newAverageRating = currentRatings.reduce((a, b) => a + b, 0) / currentRatings.length;

           await prisma.car.update({
                where : { id : data.carId },
                data : { ratings : currentRatings , averageRating : newAverageRating }
           });

      };

      if(data.brandId) {
        const brand = await prisma.brand.findUnique({
          where : { id : data.brandId}
        });


      if(!brand) {
             return ServiceResponse.failure("brand not found", null, StatusCodes.NOT_FOUND);
      };

      // ret current ratings
      // add the req rating 
      // calculate the new average rating
      // update the brand table with the new average rating


      const currentRatings = brand.ratings;
      currentRatings.push(data.rating);
      const newAverageRating = currentRatings.reduce((a, b) => a + b, 0) / currentRatings.length;

      await prisma.brand.update({
           where : { id : data.brandId },
           data : { ratings : currentRatings , averageRating : newAverageRating }
      });

      }
      
      const review = await prisma.reviews.create({
            data : {
                 ...data,
                 userId 
            }
      })

      return ServiceResponse.success("Review created.", review, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error creating review`;
      logger.error(errorMessage, error);
      return ServiceResponse.failure("An error occurred while creating review.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    
  }


  async createBrand(data:CreateBrendRequest , userId : string  , logo : string  ): Promise<ServiceResponse<any  | null>> {
    try {

      const hashedPassword = await bcrypt.hash(data.password , 10);
      data.password = hashedPassword
      const newBrand = await prisma.brand.create({
        data: {
          ...data,
          logo,
          userId,
          ratings: [],



          averageRating: 0,
        },
      });

      const { password , ...rest } = newBrand
      return ServiceResponse.success("Brand created successfully", rest, StatusCodes.CREATED);
    } catch (error : any ) {
      const errorMessage = `Error creating brand: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while creating the brand.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


   async deleteBrend ( id : string ) : Promise<ServiceResponse<any  | null>>  {
    try {
      const brend = await prisma.brand.delete({
          where : { id }
      })

      if(!brend) {
           return ServiceResponse.failure("Brend not found", null, StatusCodes.NOT_FOUND)
      }
      return ServiceResponse.success("Brand deleted successfully", brend, StatusCodes.CREATED);
    } catch (error : any ) {
      const errorMessage = `Error deleting brand: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while deleting the brand.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
   }


   async updateBrend ( id : string  , data : UpdateBrendRequest) : Promise<ServiceResponse<any  | null>>  {
    try {
      const brend = await prisma.brand.update({
        where : { id },
        data : {
              ...data 
        }
      })
      
      if(!brend) {
           return ServiceResponse.failure("Brend not found", null, StatusCodes.NOT_FOUND)
      }

      return ServiceResponse.success("Brand updated successfully", brend, StatusCodes.CREATED);
    } catch (error : any ) {
      const errorMessage = `Error updating brand: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while updating the brand.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
   }
   
}



export const brendService = new BrendService();