import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CollaboratedCarsSchema, CreateCollaboratedCarsSchema, GetCollaboratedCarsSchema, UpdateCollaboratedCarsSchema } from "./colloborate.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { collaboratedCarsController } from "./colloborate.controller";

export const collaboratedCarsRegistry = new OpenAPIRegistry();
export const colloborateRouter: Router = express.Router();

collaboratedCarsRegistry.register("CollaboratedCars", CollaboratedCarsSchema);

collaboratedCarsRegistry.registerPath({
  method: "get",
  path: "/colloborate",
  tags: ["CollaboratedCars"],
  responses: createApiResponse(z.array(CollaboratedCarsSchema), "Success"),
});

colloborateRouter.get("/", collaboratedCarsController.getCollaboratedCars);

collaboratedCarsRegistry.registerPath({
  method: "get",
  path: "/colloborate/{id}",
  tags: ["CollaboratedCars"],
  request: { params: GetCollaboratedCarsSchema.shape.params },
  responses: createApiResponse(CollaboratedCarsSchema, "Success"),
});

colloborateRouter.get("/:id", validateRequest(GetCollaboratedCarsSchema), collaboratedCarsController.getCollaboratedCar);

collaboratedCarsRegistry.registerPath({
  method: "post",
  path: "/colloborate",
  tags: ["CollaboratedCars"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateCollaboratedCarsSchema
        }
      }
    }
  },
  responses: createApiResponse(CollaboratedCarsSchema, "Success"),
});

colloborateRouter.post("/", validateRequest(z.object({ body: CreateCollaboratedCarsSchema })), collaboratedCarsController.createCollaboratedCar);

collaboratedCarsRegistry.registerPath({
  method: "put",
  path: "/colloborate/{id}",
  tags: ["CollaboratedCars"],
  request: {
    params: GetCollaboratedCarsSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: UpdateCollaboratedCarsSchema
        }
      }
    }
  },
  responses: createApiResponse(CollaboratedCarsSchema, "Success"),
});

colloborateRouter.put("/:id", validateRequest(z.object({ body: UpdateCollaboratedCarsSchema })), collaboratedCarsController.updateCollaboratedCar);

collaboratedCarsRegistry.registerPath({
  method: "delete",
  path: "/colloborate/{id}",
  tags: ["CollaboratedCars"],
  request: { params: GetCollaboratedCarsSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

colloborateRouter.delete("/:id", validateRequest(GetCollaboratedCarsSchema), collaboratedCarsController.deleteCollaboratedCar);