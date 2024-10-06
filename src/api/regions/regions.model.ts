import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface IRegion {
  id: string;
  name: string;
  cities: ICity[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ICity {
  id: string;
  name: string;
  regionId: string;
}

export const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
  regionId: z.string(),
});

export const RegionSchema = z.object({
  id: z.string(),
  name: z.string(),
  cities: z.array(CitySchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateRegionSchema = z.object({
  name: z.string(),
});

export const CreateCitySchema = z.object({
  name: z.string(),
  regionId: z.string(),
});

export const GetRegionSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const GetCitySchema = z.object({
  params: z.object({ id: z.string() }),
});

export const DeleteRegionSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const DeleteCitySchema = z.object({
  params: z.object({ id: z.string() }),
});

export type CreateRegionRequest = z.infer<typeof CreateRegionSchema>;
export type CreateCityRequest = z.infer<typeof CreateCitySchema>;