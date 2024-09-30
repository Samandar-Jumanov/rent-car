import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetUserSchema, UserSchema, CreateUserSchema, VerifyUserSchema, UpdateUserSchema  , RefreshtokenSchema, AdminLoginSchema} from "@/api/user/userModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";
import { authMiddleware, checkRole } from "@/common/middleware/auth";
import { upload } from "../aws/multer.service";
import { CreateBlockedUsersSchema, GetBlockedUsersSchema , CreateAgentBlockSchema, AdminBlockUser, AgentBlockSchema  } from "./block/block.model";
import { SessionsSchema } from "./sessions/sessions.model";
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
    query : z.object({
      location : z.string(),
      role : z.string(),
    }),
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

userRouter.put("/profile-picture", authMiddleware, upload.single("image") ,userController.uploadImage);


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


// Block

// Admin
// admin login 


userRegistry.registerPath({
  method: "post",
  path: "/users/admin/login",
  tags: ["User"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: AdminLoginSchema
        }
      }
    }
  },
  responses: createApiResponse(SessionsSchema, "Success"),
});


userRouter.delete("/session" , validateRequest(z.object({  body : AdminLoginSchema})),  userController.adminLogin);

userRegistry.registerPath({
  method: "get",
  path: "/users/admin/block",
  tags: ["User"],
  responses: createApiResponse(AdminBlockUser, "Success"), // should be changed later 
});

userRouter.get("/admin/block" , authMiddleware ,  checkRole(["ADMIN"]) ,  userController.getBlockedUsers);


userRegistry.registerPath({
  method: "post",
  path: "/users/admin/block",
  tags: ["User"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateBlockedUsersSchema
        }
      }
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.post("/admin/block" , authMiddleware ,  checkRole(["ADMIN"]) ,  userController.blockUser);


userRegistry.registerPath({
  method: "delete",
  path: "/users/admin/block",
  tags: ["User"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: GetBlockedUsersSchema
        }
      }
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.delete("/admin/block" , authMiddleware ,  checkRole(["ADMIN"]) ,  userController.cancelAgentUserBlock);



// Agent 


userRegistry.registerPath({
  method: "get",
  path: "/users/agent/block",
  tags: ["User"],
  responses: createApiResponse(AgentBlockSchema, "Success"),
});

userRouter.get("/agent/block" , authMiddleware ,  checkRole(["ADMIN"]) ,  userController.getAgentBlocked);

userRegistry.registerPath({
  method: "post",
  path: "/users/agent/block",
  tags: ["User"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateAgentBlockSchema
        }
      }
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.post("/agent/block" , authMiddleware ,  checkRole(["ADMIN"]) ,  userController.blockUser);

userRegistry.registerPath({
  method: "delete",
  path: "/users/agent/block",
  tags: ["User"],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateAgentBlockSchema
        }
      }
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.delete("/agent/block" , authMiddleware ,  checkRole(["ADMIN"]) ,  userController.blockUser);



// Session 

userRegistry.registerPath({
  method: "delete",
  path: "/users/session",
  tags: ["User"],
  request: {
       params : z.object({
            sessionId : z.string()
       })
  },
  responses: createApiResponse(SessionsSchema, "Success"),
});

userRouter.delete("/session" , authMiddleware ,  checkRole(["ADMIN"]) ,  userController.deleteSession);




