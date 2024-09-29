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
      const discount = await prisma.discount.findUnique({ where: { id }  , include : {
           car : true 
      }});
      
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
      
      const discounts = await prisma.discount.findMany({
        include: {
          car: true,
          brend: true
        }
      });

      const calculatedDiscounts: IDiscount[] = discounts.map(discount => {
        const startDate = new Date(discount.startDate);
        const endDate = new Date(discount.endDate);
        let daysRemaining: number | undefined;

        if (now < startDate) {
          daysRemaining = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        } else if (now > endDate) {
        } else {
          daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        }
        return {
          ...discount,
          daysRemaining
        };
      });

      return ServiceResponse.success<IDiscount[]>(
        "Discounts retrieved successfully",
        calculatedDiscounts
      );

    } catch (ex) {
      const errorMessage = `Error finding discounts: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding discounts.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  

}

export const discountService = new DiscountService();