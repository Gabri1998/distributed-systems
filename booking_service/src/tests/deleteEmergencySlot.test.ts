import { deleteEmergencySlot } from "../controllers/emergencySlots-controller";
import { MessageException } from "../exceptions/MessageException";
import EmergencySlotSchema from "../schemas/emergencySlots";

jest.mock("../schemas/emergencySlots");

describe("deleteEmergencySlots", () => {
  it("should throw only dentists are allowed to perform this action", async () => {
    const testData = { emergencySlot_id: "testId" };
    const requestInfo = {
      user: {
        id: "testID",
        email: "patient@patient.com",
        userType: "patient",
        admin: false,
      },
      requestID: "someRequestID",
    };

    await expect(deleteEmergencySlot(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Only dentists are allowed to perform this action",
      })
    );
  });

  it("should throw booked emergency slots are not allowed to be deleted", async () => {
    const testData = { emergencySlot_id: "testId", booked: true };
    const requestInfo = {
      user: {
        id: "testID",
        email: "patient@patient.com",
        userType: "dentist",
        admin: false,
      },
      requestID: "someRequestID",
    };

    const findByIdMock = jest.spyOn(EmergencySlotSchema, "findById");
    findByIdMock.mockResolvedValue(testData);

    await expect(deleteEmergencySlot(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Booked emergency slots are not allowed to be deleted.",
      })
    );

    findByIdMock.mockRestore();
  });
  it("should throw emergency slot does not exist", async () => {
    const testData = { emergencySlot_id: "testId" };
    const requestInfo = {
      user: {
        id: "testID",
        email: "patient@patient.com",
        userType: "dentist",
        admin: false,
      },
      requestID: "someRequestID",
    };

    const findByIdMock = jest.spyOn(EmergencySlotSchema, "findById");
    findByIdMock.mockResolvedValue(null);

    await expect(deleteEmergencySlot(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 404,
        message: "Emergency slot does not exist",
      })
    );

    findByIdMock.mockRestore();
  });
});
