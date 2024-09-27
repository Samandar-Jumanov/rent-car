import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { IDiscount, CreateDiscountRequest } from "./discount.model";

export class DiscountService {
  async createDiscount(data: CreateDiscountRequest): Promise<ServiceResponse<IDiscount | null>> {
    try {
      const discount = await prisma.discount.create({
        data: {
          ...data,
        },
      });

      return ServiceResponse.success<IDiscount>("Discount created successfully", discount);
    } catch (ex) {
      const errorMessage = `Error creating discount: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the discount.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteDiscount(id: string): Promise<ServiceResponse<boolean>> {
    try {
      await prisma.discount.delete({ where: { id } });
      return ServiceResponse.success("Discount deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting discount: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the discount.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findDiscount(id: string): Promise<ServiceResponse<IDiscount | null>> {
    try {
      const discount = await prisma.discount.findUnique({ where: { id } });
      
      if (!discount) {
        return ServiceResponse.failure("Discount not found", null, StatusCodes.NOT_FOUND);
      }
  
      const now = new Date();
      const isExpired = discount.startDate <= now && discount.endDate >= now;

      if(isExpired){
         return ServiceResponse.failure<null>("Discount expired" , null);
      }

      return ServiceResponse.success<IDiscount>("Discount found", discount as IDiscount);

    } catch (ex) {
      const errorMessage = `Error finding discount: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding the discount.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findActiveDiscounts(): Promise<ServiceResponse<IDiscount[] | null>> {
    try {
      const now = new Date();
      const activeDiscounts = await prisma.discount.findMany({
        where: {
          startDate: { lte: now },
          endDate: { gte: now },
        },
      });

      return ServiceResponse.success<IDiscount[]>(
        "Active discounts found",
        activeDiscounts as IDiscount[],
      );

    } catch (ex) {
      const errorMessage = `Error finding active discounts: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding active discounts.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  

}

export const discountService = new DiscountService();