import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CarBrendSchema, CreateCarBrendSchema, GetCarBrendSchema, DeleteCarBrendSchema } from "./car-brend.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { carBrendController } from "./car-brend.controller";
import { authMiddleware } from "@/common/middleware/auth";

export const carBrendRegistry = new OpenAPIRegistry();
export const carBrendRouter: Router = express.Router();

carBrendRegistry.register("CarBrend", CarBrendSchema);

carBrendRegistry.registerPath({
  method: "get",
  path: "/car-brands",
  tags: ["CarBrend"],
  responses: createApiResponse(z.array(CarBrendSchema), "Success"),
});

carBrendRouter.get("/", carBrendController.getCarBrends);

carBrendRegistry.registerPath({
  method: "get",
  path: "/car-brands/{id}",
  tags: ["CarBrend"],
  request: { params: GetCarBrendSchema.shape.params },
  responses: createApiResponse(CarBrendSchema, "Success"),
});

carBrendRouter.get("/:id", validateRequest(GetCarBrendSchema), carBrendController.getCarBrend);

carBrendRegistry.registerPath({
  method: "post",
  path: "/car-brands",
  tags: ["CarBrend"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateCarBrendSchema
        }
      }
    }
  },
  responses: createApiResponse(CarBrendSchema, "Success"),
});

carBrendRouter.post("/", 
  authMiddleware,
  validateRequest(z.object({ body: CreateCarBrendSchema })), 
  carBrendController.createCarBrend
);

carBrendRegistry.registerPath({
  method: "delete",
  path: "/car-brands/{id}",
  tags: ["CarBrend"],
  request: { params: DeleteCarBrendSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

carBrendRouter.delete("/:id", 
  authMiddleware,
  validateRequest(DeleteCarBrendSchema), 
  carBrendController.deleteCarBrend
);