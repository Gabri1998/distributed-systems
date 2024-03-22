import mqtt from "mqtt";
import mongoose from "mongoose";
import {
  MessageData,
  MessageHandler,
  MessagePayload,
} from "./utilities/types-utils";
import { MessageException } from "./exceptions/MessageException";
import notificationController from "./controllers/notification-controller";
const mongoURI =
  process.env.MONGODB_URI || "mongodb+srv://DIT356:gusdit356@clusterdit356.zpifkti.mongodb.net/Notification?retryWrites=true&w=majority";
const client = mqtt.connect(process.env.MQTT_URI || "mqtt://localhost:1883");

const messageMapping: { [key: string]: MessageHandler } = {
  "notification/push": notificationController.pushNotification,
  "notification/get": notificationController.getNotification,
  "notification/read": notificationController.readByUser,
};

client.on("connect", () => {
  client.subscribe("notification/#");
});

client.on("message", async (topic, message) => {
  console.log(message.toString());
  const handler = messageMapping[topic];
  if (handler) {
    const { payload, responseTopic, requestInfo } = JSON.parse(
      message.toString()
    ) as MessagePayload;
    try {
      const result = await handler(payload, requestInfo);
      client.publish(responseTopic, JSON.stringify({ data: result }), {
        qos: 2,
      });
    } catch (error) {
      if (error instanceof MessageException) {
        client.publish(
          responseTopic,
          JSON.stringify({
            error: {
              code: error.code,
              message: error.message,
            },
          }),
          { qos: 2 }
        );
      }
      client.publish(
        responseTopic,
        JSON.stringify({
          error: {
            code: 500,
            message: (error as Error).message,
          },
        }),
        { qos: 2 }
      );
    }
  }

  //client.end();}
});

// Set URI to connect to

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(function () {
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
  })
  .catch(function (err) {
    if (err) {
      console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
      console.error(err.stack);
      process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
  });
