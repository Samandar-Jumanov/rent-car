import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface ICarBrend {
  id: string;
  carBrend: string;
  cars: any[]; // You might want to replace 'any' with a proper Car interface
  createdAt: Date;
  updatedAt: Date;
}

export const CarBrendSchema = z.object({
  id: z.string(),
  carBrend: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateCarBrendSchema = z.object({
  carBrend: z.string(),
});

export const GetCarBrendSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const DeleteCarBrendSchema = z.object({
  params: z.object({ id: z.string() }),
});

export type CreateCarBrendRequest = z.infer<typeof CreateCarBrendSchema>;