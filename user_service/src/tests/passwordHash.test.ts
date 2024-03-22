import { createUser } from "../controllers/users-controller";
import { MessageException } from "../exceptions/MessageException";
import UserSchema from "../schemas/users";
import bcrypt from "bcrypt";

jest.mock("../schemas/users");

describe("createUser", () => {
  it("should hash the password before saving the user", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      SSN: "123456789",
      email: "john.doe@example.com",
      password: "securepassword",
      theme: "dark",
    };

    const validPayload = {
      responseTopic: "users/create",
      payload: userData,
      requestInfo: {},
    };

    // Mocking the behavior to simulate a new user.
    (UserSchema as jest.Mocked<typeof UserSchema>).find.mockResolvedValue([]);

    // Mocking bcrypt.hash to check if it's called with the correct password
    const bcryptHashMock = jest.spyOn(bcrypt, "hash");
    bcryptHashMock.mockImplementation((password) =>
      Promise.resolve(`hashed_${password}`)
    );

    const result = await createUser(
      validPayload.payload,
      validPayload.requestInfo
    );

    // Checking if bycrypt hashed the correct password
    expect(bcryptHashMock).toHaveBeenCalledWith(userData.password, 10);

    // Checking if the password has been only hashed once
    expect(bcryptHashMock).toHaveBeenCalledTimes(1);

    // Restore the original implementation of bcrypt.hash
    bcryptHashMock.mockRestore();
  });
});
