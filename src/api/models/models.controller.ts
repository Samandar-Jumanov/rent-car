import type { Request, RequestHandler, Response } from "express";
import { modelService } from "./models.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateModelRequest } from "./models.model";

class ModelController {
  public getModels: RequestHandler = async (req: Request, res: Response) => {
    const currentPage = req.query.currentPage;
    const pageSize = req.query.pageSize

    const serviceResponse = await modelService.findAllModels(Number(currentPage) , Number(pageSize));
    return handleServiceResponse(serviceResponse, res);
  };

  public getModel: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await modelService.findModel(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createModel: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateModelRequest = req.body;
    const serviceResponse = await modelService.createModel(body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteModel: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await modelService.deleteModel(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const modelController = new ModelController();
