import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateUserRequest, UpdateUserRequest, VerifyUserSchemaRequest } from "./userModel";

class UserController {
  public getUsers: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id 
    const serviceResponse = await userService.findUser(id);
    return handleServiceResponse(serviceResponse, res);
  };


  public createUser: RequestHandler = async (req: Request, res: Response) => {
    const body : CreateUserRequest  =  req.body;
    const serviceResponse = await userService.createUser(body.phoneNumber);
    return handleServiceResponse(serviceResponse, res);
  };

  public verifyUser: RequestHandler = async (req: Request, res: Response) => {
    const body : VerifyUserSchemaRequest  =  req.body;
    const serviceResponse = await userService.verifyUser(body.code , body.phoneNumber);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateUser: RequestHandler = async (req: Request, res: Response) => {
    const body : UpdateUserRequest  =  req.body;
    const user = req.user
    const serviceResponse = await userService.updateUser(body , String( user?.userId) ); // should be updated lately 
    return handleServiceResponse(serviceResponse, res);
  };

 public refreshToken : RequestHandler  = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    const serviceResponse = await userService.refreshToken(refreshToken);
    return handleServiceResponse(serviceResponse, res);
  };
  
}

export const userController = new UserController();
