import type { Request, RequestHandler, Response } from "express";
import { requirementsService } from "./requirement.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateRequirementsRequest, UpdateRequirementsRequest } from "./requirement.model";
import { uploadFile } from "../supabase/storage";

class RequirementsController {
  public getRequirements: RequestHandler = async (req: Request, res: Response) => {
    const currentPage = req.query.currentPage;
    const pageSize = req.query.pageSize
    const serviceResponse = await requirementsService.findAll(Number(currentPage) , Number(pageSize));
    return handleServiceResponse(serviceResponse, res);
  };

  public getRequirement: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await requirementsService.findRequirements(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createRequirements: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateRequirementsRequest  = req.body;
    const file = req.file 

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
 
    if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Uploaded file is not an image' });
    }

    const imageUrl = await uploadFile(file) 

    const data = {
         ...body,
         icon : imageUrl
    }
 
    const serviceResponse = await requirementsService.createRequirements(data);
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