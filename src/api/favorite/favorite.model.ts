import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface IFavorite {
  id: string;
  carId: string;
  userId: string;
}

export const FavoriteSchema = z.object({
  id: z.string(),
  carId: z.string(),
  userId: z.string(),
});


export const GetFavoriteSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const DeleteFavoriteSchema = z.object({
  params: z.object({ id: z.string() }),
});
