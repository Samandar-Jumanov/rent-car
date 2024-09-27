import type { Request, RequestHandler, Response } from "express";
import { featureService } from "./feature.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateFeatureRequest, UpdateFeatureRequest } from "./feature.model";

class FeatureController {
  public getFeatures: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await featureService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getFeature: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await featureService.findFeature(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createFeature: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateFeatureRequest = req.body;
    const serviceResponse = await featureService.createFeature(body);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateFeature: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body: UpdateFeatureRequest = req.body;
    const serviceResponse = await featureService.updateFeature(id, body);
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