import type { Request, RequestHandler, Response } from "express";
import { carBrendService } from "./car-brend.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateCarBrendRequest } from "./car-brend.model";

class CarBrendController {
  public getCarBrends: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await carBrendService.findAllCarBrends();
    return handleServiceResponse(serviceResponse, res);
  };

  public getCarBrend: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await carBrendService.findCarBrend(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createCarBrend: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateCarBrendRequest = req.body;
    const serviceResponse = await carBrendService.createCarBrend(body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteCarBrend: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await carBrendService.deleteCarBrend(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const carBrendController = new CarBrendController();