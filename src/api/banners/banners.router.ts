import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { BannersSchema, CreateBannersSchema, GetBannersSchema, UpdateBannersSchema } from "./banners.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { bannersController } from "./banners.controller";
import { authMiddleware, checkRole } from "@/common/middleware/auth";

export const bannersRegistry = new OpenAPIRegistry();
export const bannersRouter: Router = express.Router();

bannersRegistry.register("Banners", BannersSchema);

bannersRegistry.registerPath({
  method: "get",
  path: "/banners",
  tags: ["Banners"],
  responses: createApiResponse(z.array(BannersSchema), "Success"),
});

bannersRouter.get("/",  authMiddleware  , bannersController.getBanners);

bannersRegistry.registerPath({
  method: "get",
  path: "/banners/{id}",
  tags: ["Banners"],
  request: { params: GetBannersSchema.shape.params },
  responses: createApiResponse(BannersSchema, "Success"),
});

bannersRouter.get("/:id", authMiddleware ,  validateRequest(GetBannersSchema), bannersController.getBanner);

bannersRegistry.registerPath({
  method: "post",
  path: "/banners/{carId}",
  tags: ["Banners"],
  request: {
    params : z.object({
          carId : z.string()
    }),
    body: {
      content: {
        'application/json': {
          schema: CreateBannersSchema
        }
      }
    }
  },
  responses: createApiResponse(BannersSchema, "Success"),
});

bannersRouter.post("/:carId", authMiddleware , checkRole(["SUPER_ADMIN"]),  validateRequest(z.object({ body: CreateBannersSchema })), bannersController.createBanner);

bannersRegistry.registerPath({
  method: "put",
  path: "/banners/{id}",
  tags: ["Banners"],
  request: {
    params: GetBannersSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: UpdateBannersSchema
        }
      }
    }
  },
  responses: createApiResponse(BannersSchema, "Success"),
});

bannersRouter.put("/:id", authMiddleware , checkRole(["SUPER_ADMIN"]),  validateRequest(z.object({ params: GetBannersSchema.shape.params, body: UpdateBannersSchema })), bannersController.updateBanner);

bannersRegistry.registerPath({
  method: "delete",
  path: "/banners/{id}",
  tags: ["Banners"],
  request: { params: GetBannersSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

bannersRouter.delete("/:id", authMiddleware , checkRole(["SUPER_ADMIN"]), validateRequest(GetBannersSchema), bannersController.deleteBanner);