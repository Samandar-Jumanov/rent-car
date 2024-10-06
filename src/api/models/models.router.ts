import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { ModelSchema, CreateModelSchema, GetModelSchema, DeleteModelSchema } from "./models.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { modelController } from "./models.controller";
import { authMiddleware, checkRole } from "@/common/middleware/auth";

export const modelRegistry = new OpenAPIRegistry();
export const modelRouter: Router = express.Router();

modelRegistry.register("Model", ModelSchema);

modelRegistry.registerPath({
  method: "get",
  path: "/models",
  request : {
    query: z.object({
      currentPage: z.number().int().positive(),
      pageSize: z.number().int().positive(),
    })
  },
  tags: ["Model"],
  responses: createApiResponse(z.array(ModelSchema), "Success"),
});

modelRouter.get("/", authMiddleware ,  modelController.getModels);

modelRegistry.registerPath({
  method: "get",
  path: "/models/{id}",
  tags: ["Model"],
  request: { params: GetModelSchema.shape.params },
  responses: createApiResponse(ModelSchema, "Success"),
});

modelRouter.get("/:id", authMiddleware , checkRole(["SUPER_ADMIN"]) ,  validateRequest(GetModelSchema), modelController.getModel);

modelRegistry.registerPath({
  method: "post",
  path: "/models",
  tags: ["Model"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateModelSchema
        }
      }
    }
  },
  responses: createApiResponse(ModelSchema, "Success"),
});

modelRouter.post("/", authMiddleware , checkRole(["SUPER_ADMIN"]) ,   validateRequest(z.object({ body: CreateModelSchema })), modelController.createModel);

modelRegistry.registerPath({
  method: "delete",
  path: "/models/{id}",
  tags: ["Model"],
  request: { params: DeleteModelSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

modelRouter.delete("/:id", authMiddleware , checkRole(["SUPER_ADMIN"]) ,  validateRequest(DeleteModelSchema), modelController.deleteModel);