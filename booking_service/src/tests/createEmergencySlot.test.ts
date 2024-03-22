import { createEmergencySlot } from "../controllers/emergencySlots-controller";
import { MessageException } from "../exceptions/MessageException";
import ScoreSchema from "../schemas/score";
import EmergencySlotSchema from "../schemas/emergencySlots";

jest.mock("../schemas/emergencySlots");

describe("createEmergencySlots", () => {
  it("should throw only dentists are allowed to perform this action", async () => {
    const testData = { start: "startTime", end: "endTime" };
    const requestInfo = {
      user: {
        id: "testID",
        email: "patient@patient.com",
        userType: "patient",
        admin: false,
      },
      requestID: "someRequestID",
    };

    await expect(createEmergencySlot(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Only dentists are allowed to perform this action.",
      })
    );
  });

  it("should throw input missing data. All data required", async () => {
    const testData = { start: "startTime" };
    const requestInfo = {
      user: {
        id: "testID",
        email: "patient@patient.com",
        userType: "dentist",
        admin: false,
      },
      requestID: "someRequestID",
    };

    await expect(createEmergencySlot(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Input missing data. All data required!",
      })
    );
  });
  it("should throw invalid date format for start or end", async () => {
    const testData = { start: "startDate", end: "endDate" };
    const requestInfo = {
      user: {
        id: "testID",
        email: "patient@patient.com",
        userType: "dentist",
        admin: false,
      },
      requestID: "someRequestID",
    };

    await expect(createEmergencySlot(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Invalid date format for start or end.",
      })
    );
  });
  it("should throw the following slot already exists", async () => {
    const testData = { start: "2022-02-22", end: "2022-02-22" };
    const requestInfo = {
      user: {
        id: "testID",
        email: "patient@patient.com",
        userType: "dentist",
        admin: false,
      },
      requestID: "someRequestID",
    };

    const findMock = jest.spyOn(EmergencySlotSchema, "find");
    findMock.mockResolvedValue([testData]);

    await expect(createEmergencySlot(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "The following slot already exists",
      })
    );
    findMock.mockRestore();
  });
});
