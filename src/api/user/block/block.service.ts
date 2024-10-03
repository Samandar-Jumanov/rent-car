import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import prisma from "@/common/db/prisma";
import { CreateBlockedUsersRequest, CreateAgentBlockRequest , IBlockedUsers , IAgentBlock} from "./block.model";

class BlockService {
  // Block by admin
  async blockUser(adminId: string, blockUserId : string ): Promise<ServiceResponse<IBlockedUsers | null>> {
    try {

      const exists = await prisma.blockedUsers.findUnique({
            where : { blockedUserId : blockUserId }
      });
      
      if (exists) {
        throw new Error("User is already blocked by this admin");
      }

      const blockedUser = await prisma.blockedUsers.create({
        data: {
          adminId,
          blockedUserId: blockUserId,

        },
      });
      return ServiceResponse.success<IBlockedUsers>("User blocked successfully by admin", blockedUser);
    } catch (ex) {
      const errorMessage = `Error blocking user by admin: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while blocking the user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelBlock(id: string): Promise<ServiceResponse<boolean>> {
    try {
      await prisma.blockedUsers.delete({ where: { id } });
      return ServiceResponse.success("Block cancelled successfully", true);
    } catch (ex) {
      const errorMessage = `Error cancelling block: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while cancelling the block.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // block by agent (simple users)
  async blockUserByAgent(agentId: string, userId : string ): Promise<ServiceResponse<IAgentBlock | null>> {
    try {
      const agentBlock = await prisma.agentBlock.create({
        data: {
          agentId,
          userId: userId,
        },
      });
      return ServiceResponse.success<IAgentBlock>("User blocked successfully by agent", agentBlock);
    } catch (ex) {
      const errorMessage = `Error blocking user by agent: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while blocking the user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelBlockUser(id: string): Promise<ServiceResponse<boolean>> {
    try {
      await prisma.agentBlock.delete({ where: { id } });
      return ServiceResponse.success("Agent block cancelled successfully", true);
    } catch (ex) {
      const errorMessage = `Error cancelling agent block: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while cancelling the agent block.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Additional helper methods
  async getBlockedUsers(): Promise<ServiceResponse<IBlockedUsers[] | null>> {
    try {
      const blockedUsers = await prisma.blockedUsers.findMany({
          include : {
              blockedUser : true 
          }
      });
      return ServiceResponse.success<IBlockedUsers[]>("Blocked users retrieved successfully", blockedUsers);
    } catch (ex) {
      const errorMessage = `Error retrieving blocked users: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving blocked users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAgentBlocks( agentId : string ): Promise<ServiceResponse<IAgentBlock[] | null>> {
    try {
      const agent = await prisma.user.findUnique({
          where : { id : agentId},
          include : {
               agentBlocks : true
          }
      })

      if(!agent) {
      return ServiceResponse.failure("Agent not found", null , StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IAgentBlock[]>("Agent blocks retrieved successfully", agent?.agentBlocks );
    } catch (ex) {
      const errorMessage = `Error retrieving agent blocks: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving agent blocks.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

}

export const blockService = new BlockService();