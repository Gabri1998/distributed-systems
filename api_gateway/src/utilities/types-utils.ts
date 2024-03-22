export type MessageData = { [key: string]: unknown };
export type MessageResponse = {
  data?: { [key: string]: unknown };
  error?: { code: number; message: string };
};
export type RequestInfo = {
  user?: {
    id: string;
    email: string;
    userType: string;
    admin: boolean;
    clinic_id?: string;
    firstName?: string;
    lastName?: string;
    blackList?: boolean;
  };

  requestID: string;
};
export type MessagePayload = {
  responseTopic: string;
  payload: MessageData;
  requestInfo: RequestInfo;
};
export type MessageHandler = (data: MessageData) => Promise<unknown>;
