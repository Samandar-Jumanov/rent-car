import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const  RequestTypeSchema = z.enum(["DEMAND" , "PROPOSAL"])
export type  RequestType = z.infer<typeof RequestTypeSchema>
export interface IRequest {
  id: string;
  type: RequestType;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const RequestSchema = z.object({
  id: z.string(),
  type: RequestTypeSchema,
  userId: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateRequestSchema = z.object({
  type: RequestTypeSchema.optional(),
  content: z.string(),
});

export const GetRequestSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const DeleteRequestSchema = z.object({
  params: z.object({ id: z.string() }),
});

export type CreateRequestRequest = z.infer<typeof CreateRequestSchema>;