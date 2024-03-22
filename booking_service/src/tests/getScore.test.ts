import { getScore } from "../controllers/emergencySlots-controller";
import { MessageException } from "../exceptions/MessageException";
import ScoreSchema from "../schemas/score";

jest.mock("../schemas/score");

describe("getScore", () => {
  it("should throw dentists are not allowed to book for emergency", async () => {
    const testData = { score: 20 };
    const requestInfo = {
      user: {
        id: "testID",
        email: "patient@patient.com",
        userType: "dentist",
        admin: false,
      },
      requestID: "someRequestID",
    };

    await expect(getScore(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Dentists are not allowed to book for emergency.",
      })
    );
  });

  it("should throw Emergency score should be between 0 and 63.4", async () => {
    const testData = { score: 100 };
    const requestInfo = {
      user: {
        id: "testID",
        email: "patient@patient.com",
        userType: "patient",
        admin: false,
      },
      requestID: "someRequestID",
    };

    await expect(getScore(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Emergency score should be between 0 and 63.4",
      })
    );
  });
  it("should throw you are only allowed to submit the form once a day", async () => {
    const testData = { score: 20 };
    const requestInfo = {
      user: {
        id: "testID",
        email: "patient@patient.com",
        userType: "patient",
        admin: false,
      },
      requestID: "someRequestID",
    };

    const findMock = jest.spyOn(ScoreSchema, "find");
    findMock.mockResolvedValue([20]);

    await expect(getScore(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "You are only allowed to submit the form once a day.",
      })
    );
    findMock.mockRestore();
  });
});
