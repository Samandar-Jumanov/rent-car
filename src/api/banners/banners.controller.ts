import type { Request, RequestHandler, Response } from "express";
import { bannersService } from "./banners.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateBannersRequest, UpdateBannersRequest } from "./banners.model";

class BannersController {
  public getBanners: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await bannersService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getAllBanners : RequestHandler = async (req: Request, res: Response) => {
    const currentPage = req.query.currentPage;
    const pageSize = req.query.pageSize;

    // const serviceResponse = await bannersService.getAllBanners();
    // return handleServiceResponse(serviceResponse, res);
  };

  public getBanner: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await bannersService.findBanner(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createBanner: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateBannersRequest = req.body;
    const carId = req.params.carId;
    const serviceResponse = await bannersService.createBanner(body , String(carId));
    return handleServiceResponse(serviceResponse, res);
  };

  public updateBanner: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body: UpdateBannersRequest = req.body;
    const serviceResponse = await bannersService.updateBanner(id, body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteBanner: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await bannersService.deleteBanner(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const bannersController = new BannersController();