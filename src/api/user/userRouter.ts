import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetUserSchema, UserSchema, CreateUserSchema, VerifyUserSchema, UpdateUserSchema  , RefreshtokenSchema} from "@/api/user/userModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";
import { authMiddleware } from "@/common/middleware/auth";
import { upload } from "../aws/multer.service";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema); // register

userRegistry.registerPath({ // get all 
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get("/", userController.getUsers);

userRegistry.registerPath({ // get single 
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get("/:id", authMiddleware ,  validateRequest(GetUserSchema), userController.getUser);

userRegistry.registerPath({  // create user 
  method: "post",
  path: "/users",
  tags: ["User"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserSchema
        }
      }
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.post("/",  validateRequest(z.object({ body : CreateUserSchema })),userController.createUser);

userRegistry.registerPath({ 
  method: "patch",
  path: "/users",
  tags: ["User"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: VerifyUserSchema
        }
      }
    }
  },

  responses: createApiResponse(VerifyUserSchema, "Success"),
});

userRouter.patch("/", userController.verifyUser);


userRegistry.registerPath({
  method: "put",
  path: "/users",
  tags: ["User"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateUserSchema
        }
      }
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.put("/", authMiddleware, userController.updateUser);



userRegistry.registerPath({
  method: "put",
  path: "/users/profile-picture",
  tags: ["User"],
  summary: "Upload user profile picture",
  description: "Upload a new profile picture for the current user",
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            properties: {
              image: {
                type: "string",
                format: "binary"
              }
            }
          }
        }
      }
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.put("/profile-picture", authMiddleware, upload.single("image"), userController.uploadImage);


userRegistry.registerPath({
  method: "post",
  path: "/users/refresh-token",
  tags: ["User"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: RefreshtokenSchema
        }
      }
    }
  },
  responses: createApiResponse(RefreshtokenSchema, "Success"),
});

userRouter.post("/refresh-token" , authMiddleware ,  userController.refreshToken);
