import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { FavoriteSchema, CreateFavoriteSchema, GetFavoriteSchema, DeleteFavoriteSchema } from "./favorite.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { favoriteController } from "./favorite.controller";

export const favoriteRegistry = new OpenAPIRegistry();
export const favoriteRouter: Router = express.Router();

favoriteRegistry.register("Favorite", FavoriteSchema);

favoriteRegistry.registerPath({
  method: "get",
  path: "/favorites",
  tags: ["Favorite"],
  responses: createApiResponse(z.array(FavoriteSchema), "Success"),
});

favoriteRouter.get("/", favoriteController.getFavorites);

favoriteRegistry.registerPath({
  method: "get",
  path: "/favorites/{id}",
  tags: ["Favorite"],
  request: { params: GetFavoriteSchema.shape.params },
  responses: createApiResponse(FavoriteSchema, "Success"),
});

favoriteRouter.get("/:id", validateRequest(GetFavoriteSchema), favoriteController.getFavorite);

favoriteRegistry.registerPath({
  method: "post",
  path: "/favorites/:carId",
  tags: ["Favorite"],
  request: { params: CreateFavoriteSchema.shape.params },
  responses: createApiResponse(CreateFavoriteSchema, "Success"),
});

favoriteRouter.post("/:carId", validateRequest(z.object({ body : CreateFavoriteSchema})), favoriteController.createFavorite);  // TODO test

favoriteRegistry.registerPath({
  method: "delete",
  path: "/favorites/{id}",
  tags: ["Favorite"],
  request: { params: DeleteFavoriteSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

favoriteRouter.delete("/:id", validateRequest(DeleteFavoriteSchema), favoriteController.deleteFavorite);

favoriteRegistry.registerPath({
  method: "get",
  path: "/favorites/user",
  tags: ["Favorite"],
  responses: createApiResponse(z.array(FavoriteSchema), "Success"),
});

favoriteRouter.get("/user", favoriteController.getUserFavorites);
