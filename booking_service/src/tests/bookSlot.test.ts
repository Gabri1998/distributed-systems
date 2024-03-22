import { bookSlot } from "../controllers/slots-controller";
import { MessageException } from "../exceptions/MessageException";
import SlotSchema from "../schemas/slots";
import mongoose from "mongoose";

jest.mock("../schemas/slots");

describe("bookSlot", () => {
  it("should throw missing input needs to be specified", async () => {
    const testData = { patient_id: "testID" };
    const requestInfo = {
      user: {
        id: "testID",
        email: "patient@patient.com",
        userType: "patient",
        admin: false,
      },
      requestID: "someRequestID",
    };

    await expect(bookSlot(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "missing input needs to be specified",
      })
    );
  });

  it("should throw valid patient/slot ID needs to be specified", async () => {
    const testData = { slot_id: "testID", patient_id: "testID" };
    const requestInfo = {
      user: {
        id: "testID",
        email: "patient@patient.com",
        userType: "patient",
        admin: false,
      },
      requestID: "someRequestID",
    };

    const isValidMock = jest.spyOn(mongoose.Types.ObjectId, "isValid");
    isValidMock.mockReturnValueOnce(false);

    await expect(bookSlot(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Valid patient/slot ID needs to be specified",
      })
    );

    isValidMock.mockRestore();
  });
});
