import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface IBrend {
  id: string;
  userId: string;
  logo: string;
  brendName: string;
  ownerNumber: string;
  address: string;
  password: string;
  isTopBrend: boolean;
  topBrendId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const BrendSchema = z.object({
  id: z.string(),
  userId: z.string(),
  logo: z.string(),
  brendName: z.string(),
  ownerNumber: z.string(),
  address: z.string(),
  password: z.string(),
  isTopBrend: z.boolean(),
  topBrendId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetBrendSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const CreateBrendSchema = z.object({
  userId: z.string(),
  logo: z.string(),
  brendName: z.string(),
  ownerNumber: z.string(),
  address: z.string(),
  password: z.string(),
});

export const UpdateBrendSchema = z.object({
  logo: z.string().optional(),
  brendName: z.string().optional(),
  ownerNumber: z.string().optional(),
  address: z.string().optional(),
  password: z.string().optional(),
  isTopBrend: z.boolean().optional(),
  topBrendId: z.string().nullable().optional(),
}).refine(data => Object.values(data).some(value => value !== undefined), {
  message: "At least one field must be provided for update"
});

export type UpdateBrendRequest = z.infer<typeof UpdateBrendSchema>;
export type CreateBrendRequest = z.infer<typeof CreateBrendSchema>;