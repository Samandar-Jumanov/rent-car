import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateUserRequest, UpdateUserRequest, VerifyUserSchemaRequest } from "./userModel";
import { logger } from "@/server";

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
    const serviceResponse = await userService.createUser(body);
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

  public uploadImage: RequestHandler = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Use the actual path where the file was saved
    const imagePath = file.path;
    
    const serviceResponse = await userService.uploadImage(imagePath, String(userId));
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
