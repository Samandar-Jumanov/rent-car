import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface IBanners {
  id: string;
  carId: string;
  title: string;
  choosenImage : string 
  createdAt: Date;
  updatedAt: Date;

}

export const BannersSchema = z.object({
  id: z.string(),
  carId: z.string(),
  title: z.string(),
  choosenImage : z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateBannersSchema = z.object({
  title: z.string(),
});

export const GetBannersSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const UpdateBannersSchema = z.object({
  title: z.string(),
})

export type CreateBannersRequest = z.infer<typeof CreateBannersSchema>;
export type UpdateBannersRequest = z.infer<typeof UpdateBannersSchema>;