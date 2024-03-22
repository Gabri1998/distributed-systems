import { createDentist } from "../controllers/dentists-controller";
import { MessageException } from "../exceptions/MessageException";

describe("createDentist", () => {
  it("should throw Input missing, All data required", async () => {
    const invalidData = {
      firstName: "Tooth",
      lastName: "Ferry",
      SSN: "123456789",
      email: "Tooth@ferry.com",
      admin: false,
      clinic_id: "000000",
    };

    const payload = {
      responseTopic: "dentists/create",
      payload: invalidData,
      requestInfo: {
        user: {
          id: "someUserId",
          email: "user@example.com",
          userType: "someUserType",
          admin: true,
          clinic_id: "000000",
        },
        requestID: "someRequestId",
      },
    };

    expect.assertions(2);

    try {
      const result = await createDentist(payload.payload, payload.requestInfo);
      expect(result).toBeDefined();
    } catch (error) {
      const MessageExceptionError = error as MessageException;
      expect(MessageExceptionError).toBeInstanceOf(MessageException);
      expect(MessageExceptionError.message).toBe(
        "Input missing data, All data required"
      );
    }
  });
  it("should return forbidden", async () => {
    const testData = {
      firstName: "Tooth",
      lastName: "Ferry",
      SSN: "123456789",
      email: "Tooth@ferry.com",
      password: "strongPassword",
      admin: false,
      clinic_id: "000000",
    };

    const testPayload = {
      payload: testData,
      requestInfo: {
        user: {
          id: "someUserId",
          email: "user@example.com",
          userType: "someUserType",
          admin: false,
          clinic_id: "000000",
        },
        requestID: "someRequestId",
      },
    };

    await expect(
      createDentist(testPayload.payload, testPayload.requestInfo)
    ).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Forbidden",
      })
    );
  });
});
