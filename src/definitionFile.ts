import { Request } from "express";
export interface IAuthInfoRequest extends Request {
  isAuth: boolean;
  userId: any;
}
