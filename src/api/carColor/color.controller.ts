import type { Request, RequestHandler, Response } from "express";
import { carColorService } from "./colors.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateCarColorRequest } from "./colors.model";

class CarColorController {
  public getCarColors: RequestHandler = async (req: Request, res: Response) => {
    const currentPage = req.query.currentPage;
    const pageSize = req.query.pageSize

    const serviceResponse = await carColorService.findAllCarColors(Number(currentPage) , Number(pageSize));
    return handleServiceResponse(serviceResponse, res);
  };

  public getCarColor: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await carColorService.findCarColor(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createCarColor: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateCarColorRequest = req.body;
    const serviceResponse = await carColorService.createCarColor(body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteCarColor: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await carColorService.deleteCarColor(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const carColorController = new CarColorController();