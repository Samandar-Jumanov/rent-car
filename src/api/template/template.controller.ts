import type { Request, RequestHandler, Response } from "express";
import { smsTemplateService } from "./template.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateSmsTemplateRequest } from "./template.model";

class SmsTemplateController {
  public getSmsTemplates: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await smsTemplateService.findAllSmsTemplates();
    return handleServiceResponse(serviceResponse, res);
  };

  public getSmsTemplate: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await smsTemplateService.findSmsTemplate(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createSmsTemplate: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateSmsTemplateRequest = req.body;
    const userId = req.user?.userId
    const serviceResponse = await smsTemplateService.createSmsTemplate(body , String(userId));
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteSmsTemplate: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await smsTemplateService.deleteSmsTemplate(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const smsTemplateController = new SmsTemplateController();