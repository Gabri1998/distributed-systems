import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user_id?: string;
      email?: string;
      SSN?: string;
      request_id: string;
      user_type: string;
      admin: boolean;
      blackList: boolean;
      clinic_id?: string;
      firstName?: string;
      lastName?: string;
    }
  }
}
