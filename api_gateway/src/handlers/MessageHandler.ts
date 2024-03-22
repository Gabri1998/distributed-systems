import { RequestHandler } from "express";
import { MqttClient } from "mqtt/*";
import { getMessageResponse } from "../utilities/getMessageResponse";
import { RequestInfo } from "../utilities/types-utils";
export const messageHandler =
  (
    client: MqttClient,
    topic: string,
    callback?: (
      data: {
        [key: string]: unknown;
      },
      requestInfo: RequestInfo
    ) => void
  ): RequestHandler =>
  async (req, res, next) => {
    try {
      const requestInfo: RequestInfo = {
        user: req.user_id
          ? {
              id: req.user_id,
              email: req.email ?? "",
              userType: req.user_type,
              admin: req.admin ?? false,
              clinic_id: req.clinic_id,
            }
          : undefined,
        requestID: req.request_id,
      };

      const response = await getMessageResponse(
        client,
        topic,
        {
          ...req.body,
          ...req.params,
          ...req.query,
        },
        requestInfo,
        1
      );
      if (response.data) {
        callback?.(response.data, requestInfo);
        res.send(response.data);
      } else if (response.error) {
        res.status(response.error.code).send(response.error.message);
      }
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  };
