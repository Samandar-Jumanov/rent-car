import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CarColorSchema, CreateCarColorSchema, GetCarColorSchema, DeleteCarColorSchema } from "./colors.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { carColorController } from "./color.controller";
import { authMiddleware, checkRole } from "@/common/middleware/auth";

export const carColorRegistry = new OpenAPIRegistry();
export const carColorRouter: Router = express.Router();

carColorRegistry.register("CarColor", CarColorSchema);

carColorRegistry.registerPath({
  method: "get",
  path: "/car-colors",
  request : {
    query : z.object({
        pageSize : z.number(),
        currentPage : z.number(),
    })
},
  tags: ["CarColor"],
  responses: createApiResponse(z.array(CarColorSchema), "Success"),
});

carColorRouter.get("/",  authMiddleware , carColorController.getCarColors);

carColorRegistry.registerPath({
  method: "get",
  path: "/car-colors/{id}",
  tags: ["CarColor"],
  request: { params: GetCarColorSchema.shape.params },
  responses: createApiResponse(CarColorSchema, "Success"),
});

carColorRouter.get("/:id", authMiddleware , checkRole(["SUPER_ADMIN"]) ,  validateRequest(GetCarColorSchema), carColorController.getCarColor);

carColorRegistry.registerPath({
  method: "post",
  path: "/car-colors",
  tags: ["CarColor"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateCarColorSchema
        }
      }
    }
  },
  responses: createApiResponse(CarColorSchema, "Success"),
});

carColorRouter.post("/",  authMiddleware , checkRole(["SUPER_ADMIN"]) ,  validateRequest(z.object({ body: CreateCarColorSchema })), carColorController.createCarColor);

carColorRegistry.registerPath({
  method: "delete",
  path: "/car-colors/{id}",
  tags: ["CarColor"],
  request: { params: DeleteCarColorSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

carColorRouter.delete("/:id", authMiddleware , checkRole(["SUPER_ADMIN"]) ,   validateRequest(DeleteCarColorSchema), carColorController.deleteCarColor);