import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { brendService } from "./brendService";

class BrendController {
  public getBrends: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await brendService.getBrends();
    return handleServiceResponse(serviceResponse, res);
  };

  public getTopBrends: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await brendService.getTopBrends()
    return handleServiceResponse(serviceResponse, res);
  };

  public getBrend: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await brendService.getBrendById(id)
    return handleServiceResponse(serviceResponse, res);
  };
}

export const brendController = new BrendController();

