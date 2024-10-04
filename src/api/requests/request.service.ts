import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { IRequest, CreateRequestRequest } from "./request.model";

export class RequestService {
  async createRequest(data: CreateRequestRequest , userId : string ): Promise<ServiceResponse<IRequest | null>> {
    try {
      const request = await prisma.requests.create({
        data: {
          ...data,
          userId 
        },
      });
      
      return ServiceResponse.success<IRequest>("Request created successfully", request as IRequest);
    } catch (ex) {
      const errorMessage = `Error creating request: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the request.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteRequest(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const existing = await prisma.requests.findUnique({
        where: {
          id
        }
      });
      
      if (!existing) {
        return ServiceResponse.failure("Request not found", false, StatusCodes.NOT_FOUND);
      }

      await prisma.requests.delete({ where: { id } });
      return ServiceResponse.success("Request deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting request: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the request.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findRequest(id: string): Promise<ServiceResponse<IRequest | null>> {
    try {
      const request = await prisma.requests.findUnique({ 
        where: { id },
        include: {
          user: true
        }
      });
      
      if (!request) {
        return ServiceResponse.failure("Request not found", null, StatusCodes.NOT_FOUND);
      }
      
      return ServiceResponse.success<IRequest>("Request found", request as IRequest);
    } catch (ex) {
      const errorMessage = `Error finding request: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding the request.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllRequests(): Promise<ServiceResponse<IRequest[] | null>> {
    try {
      const requests = await prisma.requests.findMany({
        include: {
          user: true
        }
      });
      
      return ServiceResponse.success<IRequest[]>(
        "Requests retrieved successfully",
        requests as IRequest[]
      );
    } catch (ex) {
      const errorMessage = `Error finding requests: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding requests.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const requestService = new RequestService();