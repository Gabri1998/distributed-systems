//changed to fix error in getSlots function, user is not a property of MessageData 

export type MessageData={ [key: string]: unknown };
export type RequestInfo = {
    user?: { id: string; email: string; userType: string; admin:boolean,clinic_id?:string};
    requestID?:string;
    query?: {
      offset?: number;
      limit?: number;
      [key: string]: any;
  };
  };
export type MessagePayload={responseTopic:string,payload:MessageData,requestInfo:RequestInfo};
export type MessageHandler= (data:MessageData,requestInfo:RequestInfo) => Promise<unknown>;

