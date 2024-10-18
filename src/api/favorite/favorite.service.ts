import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { IFavorite } from "./favorite.model";

export class FavoriteService {
  async createFavorite(userId : string , carId : string ): Promise<ServiceResponse<IFavorite | null>> {
    try {
      const favorite = await prisma.favorite.create({
        data: {
             carId ,
             userId
        },
      });
      return ServiceResponse.success<IFavorite>("Favorite created successfully", favorite);
    } catch (ex) {
      const errorMessage = `Error creating favorite: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the favorite.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFavorite(id: string): Promise<ServiceResponse<boolean>> {
    try {
      await prisma.favorite.delete({ where: { id } });
      return ServiceResponse.success("Favorite deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting favorite: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the favorite.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findFavorite(id: string): Promise<ServiceResponse<IFavorite | null>> {
    try {
      const favorite = await prisma.favorite.findUnique({ where: { id },  include : {
        user  : true ,
        car : true 
     }});
      
      if (!favorite) {
        return ServiceResponse.failure("Favorite not found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<IFavorite>("Favorite found", favorite as IFavorite);
    } catch (ex) {
      const errorMessage = `Error finding favorite: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding the favorite.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllFavorites(): Promise<ServiceResponse<IFavorite[] | null>> {
    try {
      const favorites = await prisma.favorite.findMany({
        include : {
           user  : true ,
           car : true 
        }
      });
      return ServiceResponse.success<IFavorite[]>(
        "Favorites found",
        favorites as IFavorite[],
      );
    } catch (ex) {
      const errorMessage = `Error finding favorites: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding favorites.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserFavorites(userId: string): Promise<ServiceResponse<IFavorite[] | null>> {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId: userId },
      });
      return ServiceResponse.success<IFavorite[]>(
        "User favorites found",
        favorites as IFavorite[],
      );
    } catch (ex) {
      const errorMessage = `Error finding user favorites: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding user favorites.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const favoriteService = new FavoriteService();