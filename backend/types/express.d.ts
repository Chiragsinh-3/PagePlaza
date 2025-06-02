// @ts-nocheck
import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      id?: string;
      body: any;
      params: any;
      query: any;
      cookies: any;
      headers: any;
    }
    
    interface Response {
      cookie(name: string, value: string, options?: any): any;
      redirect(url: string): any;
      status(code: number): any;
      json(data: any): any;
      send(body: any): any;
    }
  }
}
