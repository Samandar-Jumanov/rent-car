import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { RequestSchema, CreateRequestSchema, GetRequestSchema, DeleteRequestSchema } from "./request.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { requestController } from "./request.controller"
import { authMiddleware } from "@/common/middleware/auth";

export const requestRegistry = new OpenAPIRegistry();
export const requestRouter: Router = express.Router();

requestRegistry.register("Request", RequestSchema);

requestRegistry.registerPath({
  method: "get",
  path: "/requests",
  request : {
    query: z.object({
      currentPage: z.number().int().positive(),
      pageSize: z.number().int().positive(),
    })
  },
  tags: ["Request"],
  responses: createApiResponse(z.array(RequestSchema), "Success"),
});

requestRouter.get("/", authMiddleware, requestController.getRequests);

requestRegistry.registerPath({
  method: "get",
  path: "/requests/{id}",
  tags: ["Request"],
  request: { params: GetRequestSchema.shape.params },
  responses: createApiResponse(RequestSchema, "Success"),
});

requestRouter.get("/:id", authMiddleware, validateRequest(GetRequestSchema), requestController.getRequest);

requestRegistry.registerPath({
  method: "post",
  path: "/requests",
  tags: ["Request"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateRequestSchema
        }
      }
    }
  },
  responses: createApiResponse(RequestSchema, "Success"),
});

requestRouter.post("/", authMiddleware, validateRequest(z.object({ body: CreateRequestSchema })), requestController.createRequest);

requestRegistry.registerPath({
  method: "delete",
  path: "/requests/{id}",
  tags: ["Request"],
  request: { params: DeleteRequestSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

requestRouter.delete("/:id", authMiddleware, validateRequest(DeleteRequestSchema), requestController.deleteRequest);