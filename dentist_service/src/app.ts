import mqtt from "mqtt";
import mongoose from "mongoose";
import dentistController from "./controllers/dentists-controller";
import {
  MessageData,
  MessageHandler,
  MessagePayload,
} from "./utilities/types-utils";
import { MessageException } from "./exceptions/MessageException";
const mongoURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://DIT356:gusdit356@clusterdit356.zpifkti.mongodb.net/Dentists?retryWrites=true&w=majority";
const client = mqtt.connect(process.env.MQTT_URI || "mqtt://localhost:1883");

const messageMapping: { [key: string]: MessageHandler } = {
  "dentists/create": dentistController.createDentist,
  "dentists/login": dentistController.login,
  "dentists/me/getOne": dentistController.getDentist,
  "dentists/all": dentistController.getAllDentists,
  "dentists/clinic": dentistController.getClinicDentists,
  "dentists/update/:dentist_id": dentistController.updateDentist,
  "dentists/delete/:dentist_id": dentistController.deleteDentist,
};

client.on("connect", () => {
  client.subscribe("dentists/#");
});

client.on("message", async (topic, message) => {
  console.log(message.toString());
  const handler = messageMapping[topic];
  if (handler) {
    const { payload, responseTopic, requestInfo } = JSON.parse(
      message.toString()
    ) as MessagePayload;
    try {
      console.log("message", message.toString());
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
