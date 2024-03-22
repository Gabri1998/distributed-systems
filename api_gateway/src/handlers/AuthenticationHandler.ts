import { RequestHandler } from "express";
import { MqttClient } from "mqtt/*";
import { getMessageResponse } from "../utilities/getMessageResponse";
import jwt from "jsonwebtoken";

export const loginHandler =
  (client: MqttClient, topic: string, userType: string): RequestHandler =>
  async (req, res, next) => {
    try {
      const response = await getMessageResponse(
        client,
        topic,
        { ...req.body, ...req.params },
        {
          user: req.user_id
            ? {
                id: req.user_id,
                email: req.email ?? "",
                userType: req.user_type,
                admin: req.admin ?? false,
                firstName: req.firstName,
                lastName: req.lastName,
                blackList: req.blackList,
              }
            : undefined,
          requestID: req.request_id,
        },
        1
      );
      if (response.data) {
        const token = jwt.sign(
          {
            user_id: response.data._id,
            SSN: response.data.SSN,
            email: response.data.email,
            userType: response.data.admin ? "admin" : userType,
            isAdmin: response.data.admin && response.data.userType !== "user",
            clinic_id: response.data.clinic_id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            blackList: response.data.blackList,
          },
          process.env.TOKEN_SIGN_KEY ?? "",
          {
            expiresIn: "3h",
          }
        );
        res.send({ token });
      } else if (response.error) {
        res.status(response.error.code).send(response.error.message);
      }
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  };
