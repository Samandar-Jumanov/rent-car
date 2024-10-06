import type { Request, RequestHandler, Response } from "express";
import { requestService } from "./request.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateRequestRequest } from "./request.model";

class RequestController {
  public getRequests: RequestHandler = async (req: Request, res: Response) => {
    const currentPage = req.query.currentPage;
    const pageSize = req.query.pageSize


    const serviceResponse = await requestService.findAllRequests(Number(currentPage) , Number(pageSize));
    return handleServiceResponse(serviceResponse, res);
  };

  public getRequest: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await requestService.findRequest(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createRequest: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateRequestRequest = req.body;
    const userId = req.user?.userId
    const serviceResponse = await requestService.createRequest(body , String(userId));
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteRequest: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await requestService.deleteRequest(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const requestController = new RequestController();