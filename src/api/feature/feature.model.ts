import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface IFeature {
  id: string;
  carId?: string | null;
  title: string;
  icon: string;
}

export const FeatureSchema = z.object({
  id: z.string(),
  carId: z.string().nullable(),
  title: z.string(),
  icon: z.string(),
});

export const CreateFeatureSchema = z.object({
  title: z.string(),
  icon: z.string(),
});

export const GetFeatureSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const UpdateFeatureSchema = z.object({
  title: z.string(),
  icon: z.string(),
}).refine(data => Object.values(data).some(value => value !== undefined), {
  message: "At least one field must be provided for update"
});


export const ApplyFeatureSchema = z.object({
         featuresId : z.string().array(),
         carId  : z.string(),
})

export type CreateFeatureRequest = z.infer<typeof CreateFeatureSchema>;
export type UpdateFeatureRequest = z.infer<typeof UpdateFeatureSchema>;
export type ApplyFeature =  z.infer<typeof ApplyFeatureSchema>;
