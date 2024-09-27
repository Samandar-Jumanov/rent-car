import type { Request, RequestHandler, Response } from "express";
import { discountService } from "./discount.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateDiscountRequest } from "./discount.model";

class DiscountController {
  public getDiscounts: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await discountService.findActiveDiscounts();
    return handleServiceResponse(serviceResponse, res);
  };

  public getDiscount: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await discountService.findDiscount(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createDiscount: RequestHandler = async (req: Request, res: Response) => {
    const body: CreateDiscountRequest = req.body;
    const serviceResponse = await discountService.createDiscount(body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteDiscount: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await discountService.deleteDiscount(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const discountController = new DiscountController();