import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// CollaboratedCars model
export interface ICollaboratedCars {
  id: string;
  agentId: string;
  brandId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CollaboratedCarsSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  brandId: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
});

export const CreateCollaboratedCarsSchema = z.object({
  brandId: z.string(),
});

export const GetCollaboratedCarsSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const UpdateCollaboratedCarsSchema = z.object({
  agentId: z.string().optional(),
  brandId: z.string().optional(),
}).refine(data => Object.values(data).some(value => value !== undefined), {
  message: "At least one field must be provided for update"
});

export type CreateCollaboratedCarsRequest = z.infer<typeof CreateCollaboratedCarsSchema>;
export type UpdateCollaboratedCarsRequest = z.infer<typeof UpdateCollaboratedCarsSchema>;