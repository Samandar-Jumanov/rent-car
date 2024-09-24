import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetBrendSchema, BrendSchema, CreateBrendSchema } from "./brendModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { brendController } from "./brendController";
import { CreateRentalSchema , CreateRentalRequest } from "./cars/carsModel";
export const brendRegistry = new OpenAPIRegistry();
export const brendRouter: Router = express.Router();

// Brend routes
brendRegistry.register("Brend", BrendSchema);

// GET /brends
brendRegistry.registerPath({
  method: "get",
  path: "/brends",
  tags: ["Brend"],
  responses: createApiResponse(z.array(BrendSchema), "Success"),
});
brendRouter.get("/", brendController.getBrends);

// GET /brends/top
brendRegistry.registerPath({
  method: "get",
  path: "/brends/top",
  tags: ["Brend"],
  responses: createApiResponse(z.array(BrendSchema), "Success"),
});
brendRouter.get("/top", brendController.getTopBrends);

// GET /brends/:id
brendRegistry.registerPath({
  method: "get",
  path: "/brends/{id}",
  tags: ["Brend"],
  request: { params: GetBrendSchema.shape.params },
  responses: createApiResponse(BrendSchema, "Success"),
});
brendRouter.get("/:id", validateRequest(GetBrendSchema), brendController.getBrend);

brendRegistry.registerPath({
  method: "post",
  path: "/brends/order",
  tags: ["Brend"],
  request: {
    query: z.object({
      brendId: z.string(),
      carId: z.string(),
    }),
    body: {
        content: {
          'application/json': {
            schema: CreateRentalSchema
          }
        }
      }
  },
  responses: createApiResponse(z.any(), "Success"),
});

brendRouter.post("/order", (req, res, next) => {
  const querySchema = z.object({
    brendId: z.string(),
    carId: z.string(),
  });
  const { success } = querySchema.safeParse(req.query);
  if (!success) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }
  next();
}, brendController.createOrder);

brendRegistry.registerPath({
  method: "delete",
  path: "/brends/order/{id}",
  tags: ["Brend"],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: createApiResponse(z.any(), "Success"),
});

brendRouter.delete("/order/:id", (req, res, next) => {
  const paramsSchema = z.object({
    id: z.string(),
  });
  const { success } = paramsSchema.safeParse(req.params);
  if (!success) {
    return res.status(400).json({ error: 'Invalid path parameter' });
  }
  next();
}, brendController.cancelOrder);