import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateUserRequest, UpdateUserRequest, VerifyUserSchemaRequest } from "./userModel";
import { blockService } from "./block/block.service";

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
    const query = req.query

    const queryData = {
           location : String(query.location),
           role :   String(query.role)
    }
    const serviceResponse = await userService.createUser(body , queryData);
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
  

  // block actions 
  // Admin 

  public blockAgentUser : RequestHandler  = async (req: Request, res: Response) => {

    const blockUserId  = req.params.id 
    const adminid = req.user?.userId

    if(!blockUserId) {
         return  res.status(404).json({ message : "Block user id is required" });
    }

    const serviceResponse = await blockService.blockUser(String(adminid) , blockUserId);

    return handleServiceResponse(serviceResponse, res);
  };

  public cancelAgentUserBlock : RequestHandler  = async (req: Request, res: Response) => {
    const blockUserId  = req.params.id 
    if(!blockUserId) {
         return  res.status(404).json({ message : "Block user id is required" });
    }
    const serviceResponse = await blockService.cancelBlock( blockUserId);

    return handleServiceResponse(serviceResponse, res);
  };

  public getBlockedUsers : RequestHandler  = async (req: Request, res: Response) => {
    const serviceResponse = await blockService.getBlockedUsers( );
    return handleServiceResponse(serviceResponse, res);
  };
  

  

  // agent 


  public blockUser : RequestHandler  = async (req: Request, res: Response) => {
    const blockUserId  = req.params.userId 
    const agentId = req.user?.userId
    if(!blockUserId) {
         return  res.status(404).json({ message : "Block user id is required" });
    }

    const serviceResponse = await blockService.blockUserByAgent(String(agentId), blockUserId);
    return handleServiceResponse(serviceResponse, res);
  };


  public cancelBlockUser : RequestHandler  = async (req: Request, res: Response) => {
    const blockedUserId  = req.params.userId 
    if(!blockedUserId) {
         return  res.status(404).json({ message : "Block user id is required" });
    }
    const serviceResponse = await blockService.cancelBlockUser( blockedUserId);
    return handleServiceResponse(serviceResponse, res);
  };

  
  public getAgentBlocked : RequestHandler  = async (req: Request, res: Response) => {
    const agentId = req.user?.userId
    const serviceResponse = await blockService.getAgentBlocks(String(agentId));
    return handleServiceResponse(serviceResponse, res);
  };

  // session remove 

  public  deleteSession : RequestHandler = async (req: Request, res: Response) => {
    const sessionId : string = req.params.sessionId
    const serviceResponse = await userService.removeSession(sessionId);
    return handleServiceResponse(serviceResponse, res);
  }

  
}

export const userController = new UserController();
