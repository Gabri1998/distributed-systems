import { createDentist } from "../controllers/dentists-controller";
import DentistSchema from "../schemas/dentists";
import { MessageException } from "../exceptions/MessageException";
import bcrypt from "bcrypt";

jest.mock("../schemas/dentists");

describe("createUser", () => {
  it("should return dentist alredy exists", async () => {
    const testData = {
      firstName: "Tooth",
      lastName: "Ferry",
      SSN: "123456789",
      email: "Tooth@ferry.com",
      password: "strongPassword",
      admin: false,
      clinic_id: "000000",
    };

    // Create a spy to observe the find method in DentistSchema.
    const findMock = jest.spyOn(DentistSchema, "find");
    // When the DentistSchema.find() method is ran, the spy makes it return as if there were an existing user.
    findMock.mockResolvedValueOnce([{ existingUser: "user data" }]);

    const testPayload = {
      payload: testData,
      requestInfo: {
        user: {
          id: "admin",
          email: "admin@admin.com",
          userType: "adminType",
          admin: true,
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
        message: "Dentist already exists",
      })
    );

    findMock.mockRestore();
  });

  it("should hash the password before saving the user", async () => {
    const testData = {
      firstName: "Tooth",
      lastName: "Ferry",
      SSN: "123456789",
      email: "Tooth@ferry.com",
      password: "strongPassword",
      admin: false,
      clinic_id: "000000",
    };
    (DentistSchema as jest.Mocked<typeof DentistSchema>).find.mockResolvedValue(
      []
    );

    const testPayload = {
      payload: testData,
      requestInfo: {
        user: {
          id: "admin",
          email: "admin@admin.com",
          userType: "adminType",
          admin: true,
          clinic_id: "000000",
        },
        requestID: "someRequestId",
      },
    };

    const bcryptHashMock = jest.spyOn(bcrypt, "hash");
    bcryptHashMock.mockImplementation((password) =>
      Promise.resolve(`hashed_${password}`)
    );

    const result = await createDentist(
      testPayload.payload,
      testPayload.requestInfo
    );

    expect(bcryptHashMock).toHaveBeenCalledWith(testData.password, 10);
    expect(bcryptHashMock).toHaveBeenCalledTimes(1);
    bcryptHashMock.mockRestore();
  });
});
