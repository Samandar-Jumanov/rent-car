import type { Request, RequestHandler, Response } from "express";
import { collaboratedCarsService } from "./colloborate.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateCollaboratedCarsRequest, UpdateCollaboratedCarsRequest } from "./colloborate.model";
import { logger } from "@/server";

class CollaboratedCarsController {
  public getCollaboratedCars: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await collaboratedCarsService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getCollaboratedCar: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await collaboratedCarsService.findCollaboratedCar(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createCollaboratedCar: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateCollaboratedCarsRequest = req.body;
    const agentId = req.user?.userId; // Assuming the user id is available in the request // later check it is role also 
    const serviceResponse = await collaboratedCarsService.createCollaboratedCar(body, String(agentId));
    return handleServiceResponse(serviceResponse, res);
  };

  public updateCollaboratedCar: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body: UpdateCollaboratedCarsRequest = req.body;
    const serviceResponse = await collaboratedCarsService.updateCollaboratedCar(id, body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteCollaboratedCar: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await collaboratedCarsService.deleteCollaboratedCar(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const collaboratedCarsController = new CollaboratedCarsController();