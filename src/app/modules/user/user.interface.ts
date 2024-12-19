import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  name: string;
  role: USER_ROLES;
  email: string;
  password: string;
  profile?: string;
  status: 'active' | 'hold';
  verified: boolean;
  companyName?: string;
  companyPhone?: string;
  contactPerson?: string;
  contact: string;
  address?: string;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
