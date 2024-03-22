import { login } from "../controllers/dentists-controller";
import { MessageException } from "../exceptions/MessageException";
import DentistSchema from "../schemas/dentists";

jest.mock("../schemas/dentists");

describe("loginDBChecks", () => {
  it("should return Invalid records", async () => {
    const notExistingData = {
      firstName: "Tooth",
      lastName: "Ferry",
      SSN: "123456789",
      email: "Tooth@ferry.com",
      password: "strongPassword",
      admin: false,
      clinic_id: "000000",
    };

    const dataPayload = {
      payload: notExistingData,
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

    const findOneMock = jest.spyOn(DentistSchema, "findOne");
    findOneMock.mockResolvedValueOnce(null);

    await expect(
      login(dataPayload.payload, dataPayload.requestInfo)
    ).rejects.toThrow(
      new MessageException({
        code: 401,
        message: "Invalid records",
      })
    );
  });
});
