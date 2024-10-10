import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetBrendSchema, BrendSchema, CreateBrendSchema, QueryBrendSchema, UpdateBrendSchema } from "./brendModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { brendController } from "./brendController";
import { CreateCarSchema, CreateRentalSchema, DeleteRentalSchema, GetCarSchema } from "./cars/carsModel";
import { upload } from "../aws/multer.service";
import { authMiddleware, checkRole } from "@/common/middleware/auth";

export const brendRegistry = new OpenAPIRegistry();
export const brendRouter: Router = express.Router();

// Brend routes
brendRegistry.register("Brend", BrendSchema);

// GET /brends
brendRegistry.registerPath({
  method: "get",
  path: "/brends",
  tags: ["Brend"],
  request: {
    query: z.object({
      regionId: z.string()
    })
  },
  responses: createApiResponse(z.array(BrendSchema), "Success"),
});
brendRouter.get("/", brendController.getBrends);


// GET /all/brends // query 
brendRegistry.registerPath({
  method: "get",
  path: "/brends/all",
  request : {
      query : z.object({
              currentPage : z.number(),
              pageSize : z.number()
      })
  },
  tags: ["Brend"],
  responses: createApiResponse(z.array(BrendSchema), "Success"),
});
brendRouter.get("/all", brendController.getAllBrends);
// GET /brends/top
brendRegistry.registerPath({
  method: "get",
  path: "/brends/top",
  tags: ["Brend"],
  request: {
    query: z.object({
      regionId: z.string()
    })
  },
  responses: createApiResponse(z.array(BrendSchema), "Success"),
});
brendRouter.get("/top", brendController.getTopBrends);

// POST /brends/new (Create new brend)
brendRegistry.registerPath({
  method: "post",
  path: "/brends/new",
  tags: ["Brend"],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            properties: {
              logo: { type: "string", format: "binary" },
              brendName: { type: "string" },
              ownerNumber: { type: "string" },
              address: { type: "string" },
              password: { type: "string" },
              payment: { 
                          type: "string", 
                        },
            },

          }
        },
      },
    },
    

  },
  responses: createApiResponse(BrendSchema, "Success"),
});

brendRouter.post(
  "/new",
  authMiddleware,
  checkRole(["SUPER_ADMIN"]),
  upload.single("logo"),
  validateRequest(z.object({
     body : CreateBrendSchema
  })),
  brendController.createBrend
);

// update brends 
brendRegistry.registerPath({
  method: "put",
  path: "/brends/{id}",
  tags: ["Brend"],
  request: {
    params :z.object({
        id : z.string()
    }),
    body: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            properties: {
              logo: { type: "string", format: "binary" },
              brendName: { type: "string" },
              ownerNumber: { type: "string" },
              address: { type: "string" },
              password: { type: "string" },
            },
          }
        },
      },
    },
  },
  responses: createApiResponse(BrendSchema, "Success"),
});

brendRouter.put(
  "/:id",
  authMiddleware,
  // checkRole(["SUPER_ADMIN"]),
  upload.single("logo"),
  validateRequest(z.object({
     body : UpdateBrendSchema
  })),
  brendController.updateBrand
);


brendRegistry.registerPath({
  method: "delete",
  path: "/brends/{id}",
  tags: ["Brend"],
  request: {
      params : z.object({
         id  : z.string(),
      })
  },
  responses: createApiResponse(BrendSchema, "Success"),
});

brendRouter.delete(
  "/:id",
  authMiddleware,
  checkRole(["SUPER_ADMIN"]),
  brendController.deleteBrand
);



// GET /brends/query
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

// POST /brends/order (Create order)
brendRegistry.registerPath({
  method: "post",
  path: "/brends/order",
  tags: ["Brend"],
  summary: "Create a new rental order",
  description: "Create a new rental order with user details and optional image uploads",
  request: {
    query: z.object({
      brendId: z.string(),
      carId: z.string()
    }),
    body: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            properties: {
              rentalStart: { type: "string" },
              rentalEnd: { type: "string" },
              pickupTime: { type: "string" },
              returnTime: { type: "string" },
              travelRegion: { type: "string" },
              estimatedDistance: { type: "string" },
              username: { type: "string" },
              surname: { type: "string" },
              usersFatherName: { type: "string" },
              driverLicence: { type: "string" },
              passport: { type: "string" },
              address: { type: "string" },
              passportImages: {
                type: "array",
                items: {
                  type: "string",
                  format: "binary"
                }
              },
              driverLicenceImages: {
                type: "array",
                items: {
                  type: "string",
                  format: "binary"
                }
              },
              userImage: {
                type: "string",
                format: "binary"
              },
              requirements: {
                type: "array",
                items: {
                  type: "string"
                }
              }
            },
            
            required: [
              "rentalStart", "rentalEnd", "pickupTime", "returnTime",
              "travelRegion", "estimatedDistance", "username", "surname",
              "usersFatherName", "driverLicence", "passport", "address",
              "requirements"
            ]
          }
        },
      },
    },
  },
  responses: createApiResponse(CreateRentalSchema, "Success"),
});

brendRouter.post(
  "/order",
  upload.fields([
    { name: 'userImage', maxCount: 1 },
    { name: 'passportImages', maxCount: 5 },
    { name: 'driverLicenceImages', maxCount: 5 }
  ]),
  brendController.createOrder
);

// DELETE /brends/order/:id
brendRegistry.registerPath({
  method: "delete",
  path: "/brends/order/{id}",
  tags: ["Brend"],
  request: {
    params: DeleteRentalSchema.shape.params
  },
  responses: createApiResponse(z.any(), "Success"),
});

brendRouter.delete("/order/:id", validateRequest(DeleteRentalSchema), brendController.cancelOrder);

// POST /brends/reviews
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
    body: {
      content: {  
        'application/json': {
          schema: CreateReviewRequestSchema.shape.body
        }
      }
    }
  },
  responses: createApiResponse(z.any(), "Success"),
});

brendRouter.post("/reviews", validateRequest(CreateReviewRequestSchema), brendController.addReview);

// POST /brends/:brendId/car/add
brendRegistry.registerPath({
  method: "post",
  path: "/brends/{brendId}/car/add",
  tags: ["Brend"],
  description: "Not tested yet",
  request: {
    params: z.object({
      brendId: z.string() 
    }),
    body: {
      content: {  
        'application/json': {
          schema: CreateCarSchema
        }
      }
    }
  },
  responses: createApiResponse(z.any(), "Success"),
});

brendRouter.post("/:brendId/car/add", 
  authMiddleware, 
  checkRole(["AGENT", "SUPER_ADMIN"]), 
  validateRequest(z.object({
    body: CreateCarSchema
  })), 
  brendController.addCar
);

// GET /brends/:brendId/car/:carId
brendRegistry.registerPath({
  method: "get",
  path: "/brends/{brendId}/car/{carId}",
  tags: ["Brend"],
  request: {
    params: z.object({
      brendId: z.string(),
      carId: z.string()
    })
  },
  responses: createApiResponse(z.any(), "Success"),
});

brendRouter.get("/:brendId/car/:carId", authMiddleware, brendController.getCar)