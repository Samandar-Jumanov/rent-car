import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { brendService } from "./brendService";
import { CreateRentalRequest } from "./cars/carsModel";
import { carService } from "./cars/cars.service";
import { QueryBrend } from "./brendModel";
import { logger } from "@/server";

class BrendController {
  public getBrends: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await brendService.getBrends(""); // location needed 
    return handleServiceResponse(serviceResponse, res);
  };

  public getTopBrends: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await brendService.getTopBrends("") // location needed 
    return handleServiceResponse(serviceResponse, res);
  };

  public getBrend: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await brendService.getBrendById(id)
    return handleServiceResponse(serviceResponse, res);
  };


  public createOrder: RequestHandler = async (req: Request, res: Response) => {
    const user = req.user;
    const brendId = req.query.brendId as string;
    const carId = req.query.carId as string;
  
    if (!brendId || !carId || !user) {
      return res.status(400).json({ error: 'brendId and carId are required query parameters' });
    }
  
    const body = req.body ;
   

    // Handle file uploads
    const passportImages = (req.files as { [fieldname: string]: Express.Multer.File[] })['passportImages'] || [];
    const driverLicenceImages = (req.files as { [fieldname: string]: Express.Multer.File[] })['driverLicenceImages'] || [];
  
    // Convert file information to a format that can be stored (e.g., file paths or URLs)
    const passportImagePaths = passportImages.map(file => file.path);
    const driverLicenceImagePaths = driverLicenceImages.map(file => file.path);
  
    const serviceResponse = await carService.orderBrendCar(
      brendId, 
      carId, 
      { 
        ...body,
        passportImages: passportImagePaths, 
        driverLicenceImages: driverLicenceImagePaths 
      },

      user
    );
  
    return handleServiceResponse(serviceResponse, res);
  }


  public cancelOrder : RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await carService.cancelOrder(id)
    return handleServiceResponse(serviceResponse, res);
  }

  public queryBrend  : RequestHandler = async (req: Request, res: Response) => {
       const query  =  req.query as QueryBrend
       const serviceResponse = await brendService.queryBrends(query)
     return handleServiceResponse(serviceResponse, res);
  }

  public addReview  : RequestHandler = async (req: Request, res: Response) => {
      const cardId = req.query.cardId
      const brandId  = req.query.brandId
      const body = req.body

      const data = {
           cardId ,
           brandId,
           ...body
      }

    const userId = req.user?.userId
    
    const serviceResponse = await brendService.addReview(data , String(userId))
    return handleServiceResponse(serviceResponse, res);
 }
}

export const brendController = new BrendController();

