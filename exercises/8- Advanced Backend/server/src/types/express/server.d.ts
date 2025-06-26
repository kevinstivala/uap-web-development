import { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  userId: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}