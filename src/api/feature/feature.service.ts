// src/api/feature/featureService.ts
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { IFeature, CreateFeatureRequest, UpdateFeatureRequest, ApplyFeature } from "./feature.model";

export class FeatureService {
  async findAll(): Promise<ServiceResponse<IFeature[] | null>> {
    try {
      const features = await prisma.feature.findMany();
      return ServiceResponse.success<IFeature[]>("Features found", features as IFeature[]);
    } catch (ex) {
      const errorMessage = `Error finding all features: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving features.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findFeature(id: string): Promise<ServiceResponse<IFeature | null>> {
    try {
      const feature = await prisma.feature.findUnique({ where: { id } });
      if (!feature) {
        return ServiceResponse.failure("Feature not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IFeature>("Feature found", feature as IFeature);
    } catch (ex) {
      const errorMessage = `Error finding feature with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding feature.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createFeature(data: CreateFeatureRequest): Promise<ServiceResponse<IFeature | null>> {
    try {
      const feature = await prisma.feature.create({ 
            data : {
                  ...data,
                  carId : null
            }
       });
      return ServiceResponse.success<IFeature>("Feature created successfully", feature as IFeature);
    } catch (ex) {
      const errorMessage = `Error creating feature: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the feature.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateFeature(id: string, data: UpdateFeatureRequest): Promise<ServiceResponse<IFeature | null>> {
    try {
      const feature = await prisma.feature.update({
        where: { id },
        data,
      });
      return ServiceResponse.success<IFeature>("Feature updated successfully", feature as IFeature);
    } catch (ex) {
      const errorMessage = `Error updating feature: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating the feature.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFeature(id: string): Promise<ServiceResponse<boolean>> {
    try {
      await prisma.feature.delete({ where: { id } });
      return ServiceResponse.success("Feature deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting feature: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the feature.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async  applyFeature(data: ApplyFeature): Promise<ServiceResponse<IFeature[] | null>> {
    try {
      const updatedFeatures = await prisma.$transaction(
        data.featuresId.map(featureId =>
          prisma.feature.update({
            where: { id: featureId },
            data: { carId: data.carId }
          })
        )
      );
  
      return ServiceResponse.success("Features applied successfully", updatedFeatures);
    } catch (ex) {
      const errorMessage = `Error applying features: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while applying the features.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
}
}


export const featureService = new FeatureService();