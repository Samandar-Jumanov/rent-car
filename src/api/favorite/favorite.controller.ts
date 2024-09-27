import { Request, RequestHandler, Response } from "express";
import { favoriteService } from "./favorite.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class FavoriteController {
  public getFavorites: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await favoriteService.findAllFavorites();
    return handleServiceResponse(serviceResponse, res);
  };

  public getFavorite: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await favoriteService.findFavorite(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createFavorite: RequestHandler = async (req: Request, res: Response) => {
    const  carId  = req.params.carId
    const userId = req.user?.userId;
    const serviceResponse = await favoriteService.createFavorite(carId , String(userId));
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteFavorite: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await favoriteService.deleteFavorite(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public getUserFavorites: RequestHandler = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const serviceResponse = await favoriteService.findUserFavorites(String(userId));
    return handleServiceResponse(serviceResponse, res);
  };
}

export const favoriteController = new FavoriteController();