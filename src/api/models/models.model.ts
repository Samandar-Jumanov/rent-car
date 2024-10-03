import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface IModel {
  id: string;
  modelName: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ModelSchema = z.object({
  id: z.string(),
  modelName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateModelSchema = z.object({
  modelName: z.string(),
});

export const GetModelSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const DeleteModelSchema = z.object({
  params: z.object({ id: z.string() }),
});

export type CreateModelRequest = z.infer<typeof CreateModelSchema>;
