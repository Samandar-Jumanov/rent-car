import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { brendService } from "./brendService";
import { carService } from "./cars/cars.service";
import { QueryBrend } from "./brendModel";
import { logger } from "@/server";
import { uploadFile } from "../supabase/storage";

class BrendController {

  public getBrends: RequestHandler = async (req: Request, res: Response) => {
    const regionId = req.query.regionId
    const serviceResponse = await brendService.getBrends(String(regionId));
    return handleServiceResponse(serviceResponse, res);
  };

  public getAllBrends: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await brendService.getAllBrands();
    return handleServiceResponse(serviceResponse, res);
  };
  
  public getTopBrends: RequestHandler = async (req: Request, res: Response) => {
      const regionId = req.query.regionId
      const serviceResponse = await brendService.getTopBrends(String(regionId)) 
      return handleServiceResponse(serviceResponse, res);
    };
 
  public getSomeBrends: RequestHandler = async (req: Request, res: Response) => {
    const currentPage = req.query.currentPage
    const pageSize = req.query.pageSize
    const serviceResponse = await brendService.getSomeBrands(Number(currentPage) , Number(pageSize))
    return handleServiceResponse(serviceResponse, res);
  };

  public getBrend: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await brendService.getBrendById(id)
    return handleServiceResponse(serviceResponse, res);
  };
  
  public createBrend: RequestHandler = async (req: Request, res: Response) => {
    const body =  req.body
    const file = req.file
    
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
 
    if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Uploaded file is not an image' });
    }

    const logoUrl = await uploadFile(file)
    const userId = req.user?.userId
    const serviceResponse = await brendService.createBrand(body , String(userId) , logoUrl);
    return handleServiceResponse(serviceResponse, res);
  };

  public createOrder: RequestHandler = async (req: Request, res: Response) => {
    const user = req.user;
    const brendId = req.query.brendId as string;
    const carId = req.query.carId as string;

    if(!brendId || !carId) {
      return res.status(400).json({ error: 'Brend Id and carId is required' });
    }
    if (!user) {
      return res.status(400).json({ error: 'User is not  logged in ' });
    }
  
    const body = req.body;
   

    // Handle file uploads

    if(!req.files) {
      return res.status(400).json({ message: 'No file uploaded' });
    }


    const passportImages = (req.files as { [fieldname: string]: Express.Multer.File[] })['passportImages'] || [];
    const driverLicenceImages = (req.files as { [fieldname: string]: Express.Multer.File[] })['driverLicenceImages'] || [];

    // Upload passport images
    const passportImageUrls = await Promise.all(
      passportImages.map(file => uploadFile(file))
    );

    // Upload driver license images
    const driverLicenceImageUrls = await Promise.all(
      driverLicenceImages.map(file => uploadFile(file))
    );
  
    const serviceResponse = await carService.orderBrendCar(
      brendId, 
      carId, 
      { 
        ...body,
        passportImages: passportImageUrls, 
        driverLicenceImages: driverLicenceImageUrls 
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

 public addCar: RequestHandler = async (req: Request, res: Response) => {
  try {
    const brandId = req.params.brendId; // Note: Consider renaming this to 'brandId' for consistency
    const body = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    if (!files ) {
      return res.status(400).json({ message: 'No images uploaded' });
    }


    const images = (req.files as { [fieldname: string]: Express.Multer.File[] })['images'] || []
    const imageUrls: string[] = await Promise.all(images.map(file => uploadFile(file)));

    const carData = {
      modelId: body.modelId,
      colorId: body.colorId,
      carBrendId: body.carBrendId, 
      title: body.title,
      price: Number(body.price),
      isDiscounted: body.isDiscounted === 'true',
      discountedPrice: body.discountedPrice ? Number(body.discountedPrice) : undefined,
      status: body.status,
      images: imageUrls
    };

    const userId = req.user?.userId;
    
    const serviceResponse = await carService.addCar(carData, brandId, String(userId));
    return handleServiceResponse(serviceResponse, res);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


public getCar  : RequestHandler = async (req: Request, res: Response) => {
  const carId = req.params.carId
  const serviceResponse = await carService.getOneCar(carId)
  return handleServiceResponse(serviceResponse, res);
}

public getAllCars  : RequestHandler = async (req: Request, res: Response) => {
  const serviceResponse = await carService.getAllCars()
  return handleServiceResponse(serviceResponse, res);
}

public updateBrand  : RequestHandler = async (req: Request, res: Response) => {
  const brandId = req.params.id
  const body = req.body
  const serviceResponse = await brendService.updateBrend(brandId ,  body)
  return handleServiceResponse(serviceResponse, res);
}


public deleteBrand   : RequestHandler = async (req: Request, res: Response) => {
  const brandId = req.params.id
  const serviceResponse = await brendService.deleteBrend(brandId)
  return handleServiceResponse(serviceResponse, res);
}


public createRentalRejection    : RequestHandler = async (req: Request, res: Response) => {
  const rentalId = req.params.rentalId
  const data = req.body
  const serviceResponse = await carService.rejectRental({rentalId , reason : data.reason})
  return handleServiceResponse(serviceResponse, res);
}

}

export const brendController = new BrendController();

