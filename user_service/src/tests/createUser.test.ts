import { createUser } from "../controllers/users-controller";
import { MessageException } from "../exceptions/MessageException";

describe("createUser", () => {
  it("should throw MessageException for missing data", async () => {
    // Test data for case where password(essential data) is missing.
    const invalidData = {
      firstName: "John",
      lastName: "Doe",
      SSN: "123456789",
      email: "john.doe@example.com",
      theme: "dark",
    };

    const validPayload = {
      responseTopic: "users/create",
      payload: invalidData,
      requestInfo: {},
    };

    expect.assertions(2);

    try {
      const result = await createUser(
        validPayload.payload,
        validPayload.requestInfo
      );
      expect(result).toBeDefined();
    } catch (error) {
      // Assert that the error is an instance of MessageException with the correct message
      const messageExceptionError = error as MessageException;
      expect(messageExceptionError).toBeInstanceOf(MessageException);
      expect(messageExceptionError.message).toBe(
        "Input missing data, All data required"
      );
    }
  });
});
