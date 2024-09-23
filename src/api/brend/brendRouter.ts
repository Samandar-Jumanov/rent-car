import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetBrendSchema, BrendSchema, CreateBrendSchema, UpdateBrendSchema } from "./brendModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { brendController } from "./brendController";

export const brendRegistry = new OpenAPIRegistry();
export const brendRouter : Router = express.Router();

// Brend routes
brendRegistry.register("Brend", BrendSchema);

brendRegistry.registerPath({
  method: "get",
  path: "/brends",
  tags: ["Brend"],
  responses: createApiResponse(z.array(BrendSchema), "Success"),
});

brendRouter.get("/", brendController.getBrends);

brendRegistry.registerPath({
    method: "get",
    path: "/brends/top",
    tags: ["Brend"],
    responses: createApiResponse(z.array(BrendSchema), "Success"),
  });

brendRouter.get("/top", brendController.getTopBrends);

brendRegistry.registerPath({
  method: "get",
  path: "/brends/{id}",
  tags: ["Brend"],
  request: { params: GetBrendSchema.shape.params },
  responses: createApiResponse(BrendSchema, "Success"),
});

brendRouter.get("/:id", validateRequest(GetBrendSchema), brendController.getBrend);





