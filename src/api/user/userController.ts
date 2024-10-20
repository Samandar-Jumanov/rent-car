import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { CreateUserRequest, UpdateUserRequest, VerifyUserSchemaRequest , AdminLoginRequest} from "./userModel";
import { blockService } from "./block/block.service";
import { uploadFile } from "../supabase/storage";

class UserController {

  public getUsers: RequestHandler = async (req: Request, res: Response) => {
    const currentPage = req.query.currentPage;
    const pageSize = req.query.pageSize
    const serviceResponse = await userService.findAll(Number(currentPage) , Number(pageSize));
    return handleServiceResponse(serviceResponse, res);
  };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const user = req.user
    const serviceResponse = await userService.findUser(String(user?.userId));
    return handleServiceResponse(serviceResponse, res);
  };

  public getUserRentals : RequestHandler = async (req: Request, res: Response) => {
    const user = req.user
    const serviceResponse = await userService.getRentals(String(user?.userId));
    return handleServiceResponse(serviceResponse, res);
  };



  public createUser: RequestHandler = async (req: Request, res: Response) => {
    const body : CreateUserRequest  =  req.body;
    const query = req.query

    const data = {
         ...body ,
         location : String(query.location)
    }

    const serviceResponse = await userService.createUser(data);
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
    
    const imageUrl = await uploadFile(file)
    
    const serviceResponse = await userService.uploadImage(imageUrl, String(userId));
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
  
  public updatePassword : RequestHandler  = async (req: Request, res: Response) => {
    const data = req.body
    const userId = req.user?.userId
    const serviceResponse = await userService.adminSettings(data , String(userId));
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
  // admin login 

  public adminLogin : RequestHandler = async (req: Request, res: Response) => {
    const body : AdminLoginRequest  =  req.body;
    const serviceResponse = await userService.adminLogin(body);
    return handleServiceResponse(serviceResponse, res);
  }

  public brandLogin : RequestHandler = async (req: Request, res: Response) => {
    const body : { ownerNumber : string , password : string }  =  req.body;
    const serviceResponse = await userService.brandLogin(body);
    return handleServiceResponse(serviceResponse, res);
  }
}

export const userController = new UserController();
