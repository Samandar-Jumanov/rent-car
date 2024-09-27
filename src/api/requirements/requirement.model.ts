import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface IRequirements {
  id: string;
  carId?: string | null;
  title: string;
  icon: string;
  value : string 
  createdAt: Date;
  updatedAt: Date;
}

export const RequirementsSchema = z.object({
  id: z.string(),
  carId: z.string().nullable(),
  title: z.string(),
  icon: z.string(),
  upFrontMoney: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateRequirementsSchema = z.object({
  title: z.string(),
  icon: z.string(),
  value: z.string(),
  
});

export const GetRequirementsSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const UpdateRequirementsSchema = z.object({
  title: z.string().optional(),
  icon: z.string().optional(),
  value: z.string().optional(),
}).refine(data => Object.values(data).some(value => value !== undefined), {
  message: "At least one field must be provided for update"
});


export const ApplyRequirementsSchema = z.object({
        carId : z.string(),
        requirementsId : z.string().array()
});

export type CreateRequirementsRequest = z.infer<typeof CreateRequirementsSchema>;
export type UpdateRequirementsRequest = z.infer<typeof UpdateRequirementsSchema>;
export type ApplyRequirement= z.infer<typeof ApplyRequirementsSchema>;