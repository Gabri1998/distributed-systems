import { login } from "../controllers/dentists-controller";
import { MessageException } from "../exceptions/MessageException";

describe("loginUser", () => {
  it("should return invalid data type", async () => {
    const invalidPssword = {
      SSN: "123456789",
      password: 12345678,
    };

    const dataPayload = {
      payload: invalidPssword,
      requestInfo: {
        user: {
          id: "admin",
          email: "admin@admin.com",
          userType: "adminType",
          admin: false,
          clinic_id: "000000",
        },
        requestID: "someRequestId",
      },
    };

    expect.assertions(2);
    try {
      const result = await login(dataPayload.payload, dataPayload.requestInfo);
      expect(result).toBeDefined();
    } catch (error) {
      // Assert that the error is an instance of MessageException with the correct message
      const messageExceptionError = error as MessageException;
      expect(messageExceptionError).toBeInstanceOf(MessageException);
      expect(messageExceptionError.message).toBe("Invalid Data type");
    }
  });
  it("should return All input is required when either SSN or email is missing", async () => {
    const missingId = {
      password: "12345678",
    };

    const dataPayload = {
      payload: missingId,
      requestInfo: {
        user: {
          id: "admin",
          email: "admin@admin.com",
          userType: "adminType",
          admin: false,
          clinic_id: "000000",
        },
        requestID: "someRequestId",
      },
    };
    expect.assertions(2);
    try {
      const result = await login(dataPayload.payload, dataPayload.requestInfo);
      expect(result).toBeDefined();
    } catch (error) {
      // Assert that the error is an instance of MessageException with the correct message
      const messageExceptionError = error as MessageException;
      expect(messageExceptionError).toBeInstanceOf(MessageException);
      expect(messageExceptionError.message).toBe("All input is required");
    }
  });
});
