import { unBookSlot } from "../controllers/slots-controller";
import { MessageException } from "../exceptions/MessageException";
import SlotSchema from "../schemas/slots";
import mongoose from "mongoose";

jest.mock("../schemas/slots");

describe("unbookSlot", () => {
  it("should throw slot_id needs to be specified", async () => {
    const mockSlot = {};

    const requestInfo = {
      user: {
        id: "someUserId",
        email: "user@example.com",
        userType: "user",
        admin: false,
      },
      requestID: "someRequestID",
    };

    const findByIdMock = jest.spyOn(SlotSchema, "findById");
    findByIdMock.mockResolvedValue(null);

    await expect(unBookSlot(mockSlot, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "slot_id needs to be specified",
      })
    );

    findByIdMock.mockRestore();
  });

  it("should throw valid patient/slot ID needs to be specified", async () => {
    const mockSlot = { slot_id: "exampleID" };

    const requestInfo = {
      user: {
        id: "someUserId",
        email: "user@example.com",
        userType: "user",
        admin: false,
      },
      requestID: "someRequestID",
    };

    const isValidMock = jest.spyOn(mongoose.Types.ObjectId, "isValid");
    isValidMock.mockReturnValueOnce(false);

    await expect(unBookSlot(mockSlot, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Valid patient/slot ID needs to be specified",
      })
    );

    isValidMock.mockRestore();
  });

  it("should throw slot not found for update", async () => {
    const mockSlot = { slot_id: "exampleID" };

    const requestInfo = {
      user: {
        id: "someUserId",
        email: "user@example.com",
        userType: "user",
        admin: false,
      },
      requestID: "someRequestID",
    };

    const isValidMock = jest.spyOn(mongoose.Types.ObjectId, "isValid");
    isValidMock.mockReturnValueOnce(true);

    const findByIdMock = jest.spyOn(SlotSchema, "findById");
    findByIdMock.mockResolvedValue(null);

    await expect(unBookSlot(mockSlot, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Slot not found for update",
      })
    );

    findByIdMock.mockRestore();
    isValidMock.mockRestore();
  });

  it("should throw forbidden action, slot belong to another dentist", async () => {
    const mockSlot = { slot_id: "exampleID", dentist_id: "exampleID" };

    const requestInfo = {
      user: {
        id: "not exampleID",
        email: "user@example.com",
        userType: "dentist",
        admin: false,
      },
      requestId: "someRequest",
    };

    const isValidMock = jest.spyOn(mongoose.Types.ObjectId, "isValid");
    isValidMock.mockReturnValueOnce(true);

    const findByIdMock = jest.spyOn(SlotSchema, "findById");
    findByIdMock.mockResolvedValue(mockSlot);

    await expect(unBookSlot(mockSlot, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Forbidden action, slot belong to another dentist",
      })
    );

    findByIdMock.mockRestore();
    isValidMock.mockRestore();
  });

  it("should throw forbidden action upon request of an another patient", async () => {
    const mockSlot = { slot_id: "exampleID", patient_id: "exampleID" };

    const requestInfo = {
      user: {
        id: "not exampleID",
        email: "user@example.com",
        userType: "patient",
        admin: false,
      },
      requestId: "someRequest",
    };

    const isValidMock = jest.spyOn(mongoose.Types.ObjectId, "isValid");
    isValidMock.mockReturnValueOnce(true);

    const findByIdMock = jest.spyOn(SlotSchema, "findById");
    findByIdMock.mockResolvedValue(mockSlot);

    await expect(unBookSlot(mockSlot, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Forbidden action",
      })
    );

    findByIdMock.mockRestore();
    isValidMock.mockRestore();
  });

  it("should throw forbidden action upon request of admin", async () => {
    const mockSlot = { slot_id: "exampleID" };

    const requestInfo = {
      user: {
        id: "admin",
        email: "user@example.com",
        userType: "admin",
        admin: true,
      },
      requestId: "someRequest",
    };

    const isValidMock = jest.spyOn(mongoose.Types.ObjectId, "isValid");
    isValidMock.mockReturnValueOnce(true);

    const findByIdMock = jest.spyOn(SlotSchema, "findById");
    findByIdMock.mockResolvedValue(mockSlot);

    await expect(unBookSlot(mockSlot, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Forbidden action",
      })
    );

    findByIdMock.mockRestore();
    isValidMock.mockRestore();
  });
});
