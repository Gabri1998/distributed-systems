import { MqttClient } from "mqtt";
import { v4 as uuidv4 } from "uuid";
import {
  MessageData,
  MessagePayload,
  MessageResponse,
  RequestInfo,
} from "./types-utils";

type QoS = 0 | 1 | 2;

/**
 * A function to get a response from the MQTT broker and return it as a promise
 * This aims to use transform MQTT request into a promise based request
 * @param pubTopic the topic to publish to
 * @param pubMessage the message to publish
 * @param QOS the QOS of the message
 * @returns Promise<MQTTResponse>
 */
export const getMessageResponse = async (
  client: MqttClient,
  pubTopic: string,
  pubMessage: MessageData,
  requestInfo: RequestInfo,

  QOS?: QoS
): Promise<MessageResponse> => {
  const mqttPromise = new Promise<MessageResponse>((resolve, reject) => {
    const responseTopic = `${pubTopic}/${uuidv4()}`;
    const message: MessagePayload = {
      responseTopic,
      payload: pubMessage,
      requestInfo: requestInfo,
    };

    client.subscribe(responseTopic, { qos: QOS ?? 1 });

    client.publish(pubTopic, JSON.stringify(message), {
      qos: QOS ?? 1,
    });
    setTimeout(() => {
      client.off("message", callback);
      reject(new Error("timeout"));
    }, 5000);
    const callback = (topic: string, message: Buffer) => {
      console.log("this is the message", topic, message.toString());
      if (topic === responseTopic) {
        try {
          client.off("message", callback);
          const parsed = JSON.parse(message.toString()) as MessageData;
          resolve(parsed);
        } catch (err) {
          reject(new Error("something went wrong"));
        }
      }
    };
    client.on("message", callback);
  });
  return mqttPromise;
};
