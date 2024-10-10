import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { ISmsTemplate, CreateSmsTemplateRequest } from "./template.model";

export class SmsTemplateService {
  async createSmsTemplate(data: CreateSmsTemplateRequest , userId : string ): Promise<ServiceResponse<ISmsTemplate | null>> {
    try {
      const existing = await prisma.smsTemplates.findUnique({
        where: {
          title: data.title
        }
      });
      
      if (existing) {
        return ServiceResponse.failure("SMS template with this title already exists", null, StatusCodes.BAD_REQUEST);
      }

      console.log({ data })
      const smsTemplate = await prisma.smsTemplates.create({
        data: {
          ...data,
          userId 
        },
      });

      console.log({ smsTemplate });
      
      return ServiceResponse.success<ISmsTemplate>("SMS template created successfully", smsTemplate);
    } catch (ex) {
      const errorMessage = `Error creating SMS template: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the SMS template.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteSmsTemplate(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const existing = await prisma.smsTemplates.findUnique({
        where: {
          id
        }
      });
      
      if (!existing) {
        return ServiceResponse.failure("SMS template not found", false, StatusCodes.NOT_FOUND);
      }

      await prisma.smsTemplates.delete({ where: { id } });
      return ServiceResponse.success("SMS template deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting SMS template: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the SMS template.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findSmsTemplate(id: string): Promise<ServiceResponse<ISmsTemplate | null>> {
    try {
      const smsTemplate = await prisma.smsTemplates.findUnique({ 
        where: { id },
        include : {
             user : true 
         }
        
      });
      
      if (!smsTemplate) {
        return ServiceResponse.failure("SMS template not found", null, StatusCodes.NOT_FOUND);
      }
      
      return ServiceResponse.success<ISmsTemplate>("SMS template found", smsTemplate as ISmsTemplate);
    } catch (ex) {
      const errorMessage = `Error finding SMS template: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding the SMS template.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllSmsTemplates( currentPage : number , pageSize : number ): Promise<ServiceResponse<{ templates: ISmsTemplate[], totalCount: number } | null>> {
    try {
      const skip = (currentPage - 1) * pageSize;

      const [templates, totalCount] = await prisma.$transaction([
        prisma.smsTemplates.findMany({
          skip,
          take: pageSize,
          include: {
               user : true 
            },
        }),

        prisma.smsTemplates.count()
      ]);

      return ServiceResponse.success<{ templates: ISmsTemplate[], totalCount: number }>(
        "Sms templates  found",
        { 
          templates: templates, 
          totalCount 
        }
      );
    
    } catch (ex) {
      const errorMessage = `Error finding SMS templates: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding SMS templates.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const smsTemplateService = new SmsTemplateService();