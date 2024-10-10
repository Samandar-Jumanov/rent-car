import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { RegionSchema, CitySchema, CreateRegionSchema, GetRegionSchema, DeleteRegionSchema } from "./regions.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { regionController } from "./regions.controller";
import { authMiddleware, checkRole } from "@/common/middleware/auth";

export const regionRegistry = new OpenAPIRegistry();
export const regionRouter: Router = express.Router();

regionRegistry.register("Region", RegionSchema);
regionRegistry.register("City", CitySchema);

// Region routes
regionRegistry.registerPath({
  method: "get",
  path: "/regions",
  request : {
    query: z.object({
      currentPage: z.number().int().positive(),
      pageSize: z.number().int().positive(),
    })
  },
  tags: ["Region"],
  responses: createApiResponse(z.array(RegionSchema), "Success"),
});


regionRouter.get("/", regionController.getRegions);

regionRegistry.registerPath({
  method: "get",
  path: "/regions/all",
  tags: ["Region"],
  responses: createApiResponse(z.array(RegionSchema), "Success"),
});

regionRouter.get("/all", regionController.getAllRegions);


regionRegistry.registerPath({
  method: "get",
  path: "/regions/{id}",
  tags: ["Region"],
  request: { params: GetRegionSchema.shape.params },
  responses: createApiResponse(RegionSchema, "Success"),
});

regionRouter.get("/:id", validateRequest(GetRegionSchema), regionController.getRegion);

regionRegistry.registerPath({
  method: "post",
  path: "/regions",
  tags: ["Region"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateRegionSchema
        }
      }
    }
  },
  responses: createApiResponse(RegionSchema, "Success"),
});

regionRouter.post("/", authMiddleware, checkRole(["SUPER_ADMIN"]), validateRequest(z.object({ body: CreateRegionSchema })), regionController.createRegion);

regionRegistry.registerPath({
  method: "delete",
  path: "/regions/{id}",
  tags: ["Region"],
  request: { params: DeleteRegionSchema.shape.params },
  responses: createApiResponse(z.boolean(), "Success"),
});

regionRouter.delete("/:id", authMiddleware, checkRole(["SUPER_ADMIN"]), validateRequest(DeleteRegionSchema), regionController.deleteRegion);

