import { login } from "../controllers/users-controller";
import { MessageException } from "../exceptions/MessageException";

describe("login a user", () => {
  it("should return invalid data type when provided a not string type password", async () => {
    const invalidPassword = {
      SSN: "123456789",
      password: 12345678, // This is a Num form which is not String
    };

    const payload = {
      responseTopic: "users/create",
      payload: invalidPassword,
      requestInfo: {},
    };

    expect.assertions(2);
    try {
      const result = await login(payload.payload, payload.requestInfo);
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

    const payload = {
      responseTopic: "users/create",
      payload: missingId,
      requestInfo: {},
    };

    expect.assertions(2);
    try {
      const result = await login(payload.payload, payload.requestInfo);
      expect(result).toBeDefined();
    } catch (error) {
      // Assert that the error is an instance of MessageException with the correct message
      const messageExceptionError = error as MessageException;
      expect(messageExceptionError).toBeInstanceOf(MessageException);
      expect(messageExceptionError.message).toBe("All input is required");
    }
  });
});
