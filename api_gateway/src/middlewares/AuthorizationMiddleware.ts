import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const authorizationMiddleware: (allowAnonymous?: boolean) => RequestHandler =
  (allowAnonymous?: boolean) => async (req, res, next) => {
    if (allowAnonymous) {
      next();
      return;
    }
    if (!req.headers.authorization) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    try {
      console.log(req.headers.authorization);
      const token = jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.TOKEN_SIGN_KEY ?? ""
      ) as jwt.JwtPayload;

      req.user_id = token.user_id;
      req.email = token.email;
      req.SSN = token.SSN;
      req.user_type = token.userType;
      req.admin = token.isAdmin??false;
      req.clinic_id=token.clinic_id;
      req.firstName= token.firstName;
      req.lastName= token.lastName;
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    next();
  };
export default authorizationMiddleware;
