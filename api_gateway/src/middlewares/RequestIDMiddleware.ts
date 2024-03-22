import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";

const requestIDMiddleware: RequestHandler = async (req, res, next) => {
  req.request_id = uuidv4();
  next();
};
export default requestIDMiddleware;
