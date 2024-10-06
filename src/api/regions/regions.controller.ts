import type { Request, RequestHandler, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateRegionRequest } from "./regions.model";
import { regionService } from "./regions.service";


class RegionController {
  public getRegions: RequestHandler = async (req: Request, res: Response) => {

    const currentPage = req.query.currentPage;
    const pageSize = req.query.pageSize
    const serviceResponse = await regionService.findAllRegions(Number(currentPage), Number(pageSize));
    return handleServiceResponse(serviceResponse, res);
  };

  public getRegion: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await regionService.findRegion(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createRegion: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateRegionRequest = req.body;
    const serviceResponse = await regionService.createRegion(body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteRegion: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await regionService.deleteRegion(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const regionController = new RegionController();