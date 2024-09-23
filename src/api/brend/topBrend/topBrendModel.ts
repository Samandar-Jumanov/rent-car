import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface ITopBrend {
  id: string;
  userId: string;
  brendId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const TopBrendSchema = z.object({
  id: z.string(),
  userId: z.string(),
  brendId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetTopBrendSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const CreateTopBrendSchema = z.object({
  userId: z.string(),
  brendId: z.string(),
});

export const UpdateTopBrendSchema = z.object({
  userId: z.string().optional(),
  brendId: z.string().optional(),
}).refine(data => Object.values(data).some(value => value !== undefined), {
  message: "At least one field must be provided for update"
});

export type UpdateTopBrendRequest = z.infer<typeof UpdateTopBrendSchema>;
export type CreateTopBrendRequest = z.infer<typeof CreateTopBrendSchema>;