import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface IDiscount {
  id: string;
  carId?: string | null;
  brendId?: string | null;
  startDate: Date;
  endDate: Date;
  discountPercentage: number;
  discountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const DiscountSchema = z.object({
  id: z.string(),
  carId: z.string().nullable(),
  brendId: z.string().nullable(),
  startDate: z.date(),
  endDate: z.date(),
  discountPercentage: z.number().min(0).max(100),
  discountId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateDiscountSchema = z.object({
  carId: z.string().optional(),
  brendId: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  discountPercentage: z.number().min(0).max(100),
  discountId: z.string(),
});

export const GetDiscountSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const DeleteDiscountSchema = z.object({
  params: z.object({ id: z.string() }),
});

export type CreateDiscountRequest = z.infer<typeof CreateDiscountSchema>;