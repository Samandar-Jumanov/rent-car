import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface ICarColor {
  id: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CarColorSchema = z.object({
  id: z.string(),
  color: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateCarColorSchema = z.object({
  color: z.string(),
});

export const GetCarColorSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const DeleteCarColorSchema = z.object({
  params: z.object({ id: z.string() }),
});

export type CreateCarColorRequest = z.infer<typeof CreateCarColorSchema>;
