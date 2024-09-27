import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetBrendSchema, BrendSchema, CreateBrendSchema, QueryBrendSchema } from "./brendModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { brendController } from "./brendController";
import { CreateRentalSchema  , DeleteRentalSchema , CreateRentalQuerySchema } from "./cars/carsModel";

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

// Query brends 
brendRegistry.registerPath({
  method: "get",
  path: "/brends/query",
  tags: ["Brend"],
  request: { query: QueryBrendSchema },
  responses: createApiResponse(z.array(BrendSchema), "Success"),
});

brendRouter.get("/query", validateRequest(QueryBrendSchema), brendController.queryBrend);

// GET /brends/:id
brendRegistry.registerPath({
  method: "get",
  path: "/brends/{id}",
  tags: ["Brend"],
  request: { params: GetBrendSchema.shape.params },
  responses: createApiResponse(BrendSchema, "Success"),
});

brendRouter.get("/:id", validateRequest(GetBrendSchema), brendController.getBrend);

// Create order 
brendRegistry.registerPath({
  method: "post",
  path: "/brends/order",
  tags: ["Brend"],
  request: {
    query: CreateRentalQuerySchema,
    body: {
        content: {
          'application/json': {
            schema: CreateRentalSchema
          }
        }
      }
  },
  responses: createApiResponse(CreateRentalSchema, "Success"),
});
brendRouter.post("/order" , validateRequest(CreateRentalSchema),brendController.createOrder);


// Delete order
brendRegistry.registerPath({
  method: "delete",
  path: "/brends/order/{id}",
  tags: ["Brend"],
  request: {
      params : DeleteRentalSchema.shape.params
  },

  responses: createApiResponse(z.any(), "Success"),
});
brendRouter.delete("/order/:id",  validateRequest(DeleteRentalSchema) , brendController.cancelOrder);


// Delete order
brendRegistry.registerPath({
  method: "post",
  path: "/brends/order/{id}",
  tags: ["Brend"],
  request: {
      params : DeleteRentalSchema.shape.params
  },

  responses: createApiResponse(z.any(), "Success"),
});
brendRouter.delete("/order/:id",  validateRequest(DeleteRentalSchema) , brendController.cancelOrder);



const CreateReviewRequestSchema = z.object({
  query: z.object({
    carId: z.string().optional(),
    brandId: z.string().optional(),
  }).refine(data => data.carId || data.brandId, {
    message: "Either carId or brandId must be provided",
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5),
    review: z.string().optional(),
  }),
});

brendRegistry.registerPath({
  method: "post",
  path: "/brends/reviews",
  tags: ["Brend"],
  request: {
    query: CreateReviewRequestSchema.shape.query,
    body:{
         content  : {  
            'application/json': {
              schema:CreateReviewRequestSchema.shape.body
            }
         }
    }
  },

  responses: createApiResponse(z.any(), "Success"),
});
