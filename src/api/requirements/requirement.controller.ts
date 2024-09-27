import type { Request, RequestHandler, Response } from "express";
import { requirementsService } from "./requirement.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateRequirementsRequest, UpdateRequirementsRequest } from "./requirement.model";

class RequirementsController {
  public getRequirements: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await requirementsService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getRequirement: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await requirementsService.findRequirements(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createRequirements: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateRequirementsRequest = req.body;
    const serviceResponse = await requirementsService.createRequirements(body);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateRequirements: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body: UpdateRequirementsRequest = req.body;
    const serviceResponse = await requirementsService.updateRequirements(id, body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteRequirements: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await requirementsService.deleteRequirements(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public applyRequirements: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await requirementsService.applyRequirements(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const requirementsController = new RequirementsController();