import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { FavoriteSchema, GetFavoriteSchema, DeleteFavoriteSchema } from "./favorite.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { favoriteController } from "./favorite.controller";
import { authMiddleware } from "@/common/middleware/auth";

export const favoriteRegistry = new OpenAPIRegistry();
export const favoriteRouter: Router = express.Router();

favoriteRegistry.register("Favorite", FavoriteSchema);


favoriteRegistry.registerPath({
  method: "post",
  path: "/favorites/{carId}",
  tags: ["Favorite"],
  request: {
    params:z.object({ carId: z.string()}),
  },
  responses: createApiResponse(FavoriteSchema, "Success"),
});

favoriteRouter.post("/:carId", authMiddleware ,  favoriteController.createFavorite);


favoriteRegistry.registerPath({
  method: "get",
  path: "/favorites/user",
  tags: ["Favorite"],
  responses: createApiResponse(z.array(FavoriteSchema), "Success"),
});

favoriteRouter.get("/user", authMiddleware ,  favoriteController.getUserFavorites);


favoriteRegistry.registerPath({
  method: "get",
  path: "/favorites/{id}",
  tags: ["Favorite"],
  request: { params: GetFavoriteSchema.shape.params },
  responses: createApiResponse(FavoriteSchema, "Success"),
});

favoriteRouter.get("/:id", validateRequest(GetFavoriteSchema), favoriteController.getFavorite);


favoriteRegistry.registerPath({
  method: "delete",
  path: "/favorites/{id}",
  tags: ["Favorite"],
  request: { params: DeleteFavoriteSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

favoriteRouter.delete("/:id", validateRequest(DeleteFavoriteSchema), favoriteController.deleteFavorite);

