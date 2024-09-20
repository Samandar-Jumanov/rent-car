import type { User } from "@/api/user/userModel";

// Extended User type to include verification fields
interface VerifiableUser extends User {
  verificationCode?: string;
  isVerified: boolean;
}

// Updated mock data
export const users: VerifiableUser[] = [
  {
    id: 1,
    phoneNumber: '122',
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    isVerified: false,
  },
  {
    id: 2,
    phoneNumber: '123',
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    isVerified: false,
  },
];

export class UserRepository {
  async findAllAsync(): Promise<VerifiableUser[]> {
    return users;
  }

  async findByIdAsync(id: number): Promise<VerifiableUser | null> {
    return users.find((user) => user.id === id) || null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<VerifiableUser | null> {
    return users.find((user) => user.phoneNumber === phoneNumber) || null;
  }

  async createAsync(user: VerifiableUser): Promise<VerifiableUser> {
    const newUser = { ...user, id: users.length + 1 };
    users.push(newUser);
    return newUser;
  }

  async setVerificationCode(id: number, code: string): Promise<void> {
    const user = await this.findByIdAsync(id);
    if (user) {
      user.verificationCode = code;
      user.updatedAt = new Date();
    } else {
      throw new Error('User not found');
    }
  }

  async markAsVerified(id: number): Promise<void> {
    const user = await this.findByIdAsync(id);
    if (user) {
      user.isVerified = true;
      user.verificationCode = undefined;
      user.updatedAt = new Date();
    } else {
      throw new Error('User not found');
    }
  }

  async updateAsync(id: number, updateData: Partial<VerifiableUser>): Promise<VerifiableUser | null> {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updateData, updatedAt: new Date() };
      return users[userIndex];
    }
    return null;
  }

  async deleteAsync(id: number): Promise<boolean> {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      return true;
    }
    return false;
  }
}