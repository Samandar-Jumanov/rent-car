import type { Request, RequestHandler, Response } from "express";
import { featureService } from "./feature.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateFeatureRequest, UpdateFeatureRequest } from "./feature.model";
import { uploadFile } from "../supabase/storage";

class FeatureController {
  public getFeatures: RequestHandler = async (req: Request, res: Response) => {

    const currentPage = req.query.currentPage;
    const pageSize = req.query.pageSize

    const serviceResponse = await featureService.findAll(Number(currentPage) , Number(pageSize));
    return handleServiceResponse(serviceResponse, res);
  };

  public getFeature: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await featureService.findFeature(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createFeature: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateFeatureRequest = req.body;
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
        icon : imageUrl
    }

    const serviceResponse = await featureService.createFeature(data);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateFeature: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body: { title : string } = req.body;
    

    const serviceResponse = await featureService.updateFeature(id, body.title);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteFeature: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await featureService.deleteFeature(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public applyFeature: RequestHandler = async (req: Request, res: Response) => {
    const body = req.body
    const serviceResponse = await featureService.applyFeature(body);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const featureController = new FeatureController();