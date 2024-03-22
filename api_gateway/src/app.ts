import mqtt from "mqtt";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import requestIDMiddleware from "./middlewares/RequestIDMiddleware";
import { messageHandler } from "./handlers/MessageHandler";
import { loginHandler } from "./handlers/AuthenticationHandler";
import authorizationMiddleware from "./middlewares/AuthorizationMiddleware";
import { getMessageResponse } from "./utilities/getMessageResponse";
import { RequestInfo } from "./utilities/types-utils";
import { format } from "date-fns";
import ws from "ws";
import morgan from 'morgan';
import fs from 'fs';
dotenv.config();

const client = mqtt.connect(process.env.MQTT_URI ?? "");

const routes: Record<
  "post" | "get" | "put" | "delete",
  {
    url: string;
    topic: string;
    allowAnonymous?: boolean;
    callback?: (
      data: { [key: string]: unknown },
      requestInfo: RequestInfo
    ) => void;
  }[]
> = {
  post: [
    {
      url: "users",
      topic: "users/create",
      allowAnonymous: true,
    },
    {
      url: "dentists",
      topic: "dentists/create",
    },
    {
      url: "clinics",
      topic: "clinics/create",
    },
    {
      url: "slots",
      topic: "slots/create",
    },

    {
      url: "slots/many",
      topic: "slots/create/many",
    },
    {
      url: "slots/:slot_id/book",
      topic: "slots/:slot_id/book",
      callback: async (
        { patient_id, clinic_id, dentist_id, start },
        requestInfo
      ) => {
        const clinicData = await getMessageResponse(
          client,
          "clinics/getOne",
          {
            clinic_id,
          },
          requestInfo
        );
        const dentistData = await getMessageResponse(
          client,
          "dentists/me/getOne",
          {
            dentist_id,
          },
          requestInfo
        );

        const userData = await getMessageResponse(
          client,
          "users/me/getOne",
          {
            user_id: patient_id,
          },
          requestInfo
        );

        const message = `Dear patient, your appointment has been booked at (${
          clinicData.data?.clinicName
        }) clinic on (${format(`${start}`, "yyyy-MM-dd HH:mm")}) with our dentist (${
          dentistData.data?.firstName
        }).`;

        const dMessage = `(${userData.data?.firstName}) has booked an appointment with you at (${
          clinicData.data?.clinicName
        }) clinic on (${format(`${start}`, "yyyy-MM-dd HH:mm")})`;
        await getMessageResponse(
          client,
          "notification/push",
          {
            user_id: patient_id,
            note: message,
            type: "slot_booked",
          },
          requestInfo
        );

        wsServer.clients.forEach((client) => {
          const clientIdentifier = (client as any).identifier;
          if (clientIdentifier.includes(patient_id)) {
            client.send(message);
          }
        });
        wsServer.clients.forEach((client) => {
          const clientIdentifier = (client as any).identifier;
          if (clientIdentifier.includes(dentist_id)) {
            client.send(dMessage);
          }
        });
      },
    },
    {
      url: "slots/:slot_id/unbook",
      topic: "slots/:slot_id/unbook",
      callback: async (
        { patient_id, clinic_id, dentist_id, start },
        requestInfo
      ) => {
        const clinicData = await getMessageResponse(
          client,
          "clinics/getOne",
          {
            clinic_id,
          },
          requestInfo
        );
        const dentistData = await getMessageResponse(
          client,
          "dentists/me/getOne",
          {
            dentist_id,
          },
          requestInfo
        );
        const userData = await getMessageResponse(
          client,
          "users/me/getOne",
          {
            user_id: patient_id,
          },
          requestInfo
        );

        const message = `Dear Patient, your appointment in the clinic (${
          clinicData.data?.clinicName
        }) on (${format(`${start}`, "yyyy-MM-dd HH:mm")}) with dentist (${
          dentistData.data?.firstName
        }) is unbooked.`;

        const dMessage = `Your appointment in (${
          clinicData.data?.clinicName
        }) at  (${format(`${start}`, "yyyy-MM-dd HH:mm")}) with patient (${
          userData.data?.firstName
        }) is unbooked.`;
        await getMessageResponse(
          client,
          "notification/push",
          {
            user_id: patient_id,
            note: message,
            type: "slot_unbooked",
          },
          requestInfo
        );

        wsServer.clients.forEach((client) => {
          const clientIdentifier = (client as any).identifier;
          if (clientIdentifier.includes(patient_id)) {
            client.send(message);
          }
        });

        wsServer.clients.forEach((client) => {
          const clientIdentifier = (client as any).identifier;
          if (clientIdentifier.includes(dentist_id)) {
            client.send(dMessage);
          }
        });
      },
    },
    {
      url: "emergency-slots/score",
      topic: "emergency-slots/score",
    },
    {
      url: "emergency-slots/create",
      topic: "emergency-slots/create",
    },
    
  ],
  get: [
    {
      url: "users/:user_id",
      topic: "users/me/getOne",
    },
    {
      url: "users",
      topic: "users",
    },
    {
      url: "dentists/:dentist_id",
      topic: "dentists/me/getOne",
    },
    {
      url: "dentists",
      topic: "dentists/all",
    },
    {
      url: "dentists/clinic/:clinic_id",
      topic: "dentists/clinic",
    },
    
    {
      url: "clinics/:clinic_id",
      topic: "clinics/getOne",
    },
    {
      url: "clinics",
      topic: "clinics/all",
    },
    {
      url: "slots/:slot_id",
      topic: "slots/:slot_id",
    },
    {
      url: "slots/clinic/:clinic_id",
      topic: "slots/clinic",
    },
    {
      url: "slots/dentist/:dentist_id",
      topic: "slots/dentist",
    },
    {
      url: "slots",
      topic: "slots/all",
    },
    {
      url: "slots/patient/:patient_id",
      topic: "slots/patient",
    },
    {
      url: "notification",
      topic: "notification/get",
    },
    {
      url: "notification/read/:notification_id",
      topic: "notification/read",
    },
    {
      url: "emergency-slots/results",
      topic: "emergency-slots/results",
    },
    {
      url: "emergency-slots/:date",
      topic: "emergency-slots/:date",
    },
  ],
  put: [
    {
      url: "users/:user_id",
      topic: "users/update/:user_id",
    },
    {
      url: "dentists/:dentist_id",
      topic: "dentists/update/:dentist_id",
    },
    {
      url: "clinics/:clinic_id",
      topic: "clinics/update/:clinic_id",
    },
    {
      url: "slots/:slot_id",
      topic: "slots/update/:slot_id",
    },
  ],
  delete: [
    {
      callback: async (
        { user_id },
        requestInfo
      ) => {
        await getMessageResponse(
          client,
          "slots/patient/delete",
          {
            patient_id:user_id,
          },
          requestInfo
        );
      
      },
      url: "users/:user_id",
      topic: "users/delete/:user_id",

      
    },
    {
      url: "users",
      topic: "users/delete",
    },
    {
      url: "dentists/:dentist_id",
      topic: "dentists/delete/:dentist_id",
    },
    {
      url: "dentists",
      topic: "dentists/delete",
    },
    {
      url: "clinics/:clinic_id",
      topic: "clinics/delete/:clinic_id",
    },
    {
      url: "clinics",
      topic: "clinics/delete",
    },
    {
      url: "slots/:slot_id",
      topic: "slots/delete/:slot_id",
    },
    {
      url: "slots",
      topic: "slots/delete",
    },
    {
      url: "slots/patient/:patient_id",
      topic: "slots/patient/delete",
    }
    ,
    {
      url: "emergency-slots/:emergencySlot_id",
      topic: "emergency-slots/delete/:emergencySlot_id",
    },
  ],
};

client.on("connect", () => {
  console.log("connected");
});

const socketClient = [];
const app = express();
var accessLogStream = fs.createWriteStream("./logs/access.log", { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

app.options("*", cors());
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIDMiddleware);

app.post("/api/v1/users/login", loginHandler(client, "users/login", "patient"));
app.post(
  "/api/v1/dentists/login",
  loginHandler(client, "dentists/login", "dentist")
);

app.get("/api/v1/status", (req, res) => {
  res.send({ status: "up", requestID: req.request_id });
});
app.post("/api/v1/send-message", (req, res) => {
  const { user_id, message } = req.body;
  wsServer.clients.forEach((client) => {
    const clientIdentifier = (client as any).identifier;
    if (clientIdentifier.includes(user_id)) {
      client.send(message);
    }
  });
  res.send({ status: "up", requestID: req.request_id });
});

app.get("/api/v1/me", authorizationMiddleware(), (req, res) => {
  res.send({
    id: req.user_id,
    email: req.email,
    userType: req.user_type,
    admin: req.admin,
    firstName: req.firstName,
    lastName: req.lastName,
    clinic_id: req.clinic_id,
  });
});

routes.post.forEach((route) => {
  app.post(
    `/api/v1/${route.url}`,
    authorizationMiddleware(route.allowAnonymous),
    messageHandler(client, route.topic, route.callback)
  );
});
routes.get.forEach((route) => {
  app.get(
    `/api/v1/${route.url}`,
    authorizationMiddleware(route.allowAnonymous),
    messageHandler(client, route.topic, route.callback)
  );
});

routes.put.forEach((route) => {
  app.put(
    `/api/v1/${route.url}`,
    authorizationMiddleware(route.allowAnonymous),
    messageHandler(client, route.topic, route.callback)
  );
});
routes.delete.forEach((route) => {
  app.delete(
    `/api/v1/${route.url}`,
    authorizationMiddleware(route.allowAnonymous),
    messageHandler(client, route.topic, route.callback)
  );
});

const wsServer = new ws.Server({ noServer: true });
wsServer.on("connection", (socket, request) => {
  (socket as any).identifier = request.url;
  socket.on("message", (message) => console.log(message));
});

const server = app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${process.env.PORT}`);
});

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    (socket as any).identifier = request.url;

    wsServer.emit("connection", socket, request);
  });
});
