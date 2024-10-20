import type { Request, RequestHandler, Response } from "express";
import { bannersService } from "./banners.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateBannersRequest, UpdateBannersRequest } from "./banners.model";
import { updateFile, uploadFile } from "../supabase/storage";
import { logger } from "@/server";

class BannersController {
  public getBanners: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await bannersService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getAllBanners : RequestHandler = async (req: Request, res: Response) => {
    const currentPage = req.query.currentPage;
    const pageSize = req.query.pageSize;

    const serviceResponse = await bannersService.getBanners(Number(currentPage), Number(pageSize));
    return handleServiceResponse(serviceResponse, res);
  };

  public getBanner: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await bannersService.findBanner(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createBanner: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateBannersRequest = req.body;
    const carId = req.params.carId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
 
    if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Uploaded file is not an image' });
    }

    const imageUrl = await uploadFile(file) 

    const data = {
         title : body.title,
         choosenImage : imageUrl
    }

    
    const serviceResponse = await bannersService.createBanner(data , String(carId));
    return handleServiceResponse(serviceResponse, res);
  };


  public updateBanner: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body;
    const file = req.file
   
    if(file) {
         const imageUrl = await uploadFile(file)
         body.choosenImage = imageUrl 
    }else {
         body.choosenImage = null 
    }

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