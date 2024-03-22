import { getDentist } from "../controllers/dentists-controller";
import { MessageException } from "../exceptions/MessageException";
import DentistSchema from "../schemas/dentists";

jest.mock("../schemas/dentists");

describe("getDentist functions", () => {
  it("should return dentist if found", async () => {
    const mockDentistId = "dentistId";
    const mockDentist = { _id: mockDentistId };

    const dataPayload = {
      payload: mockDentist,
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

    const findByIdMock = jest.spyOn(DentistSchema, "findById");
    findByIdMock.mockResolvedValue(mockDentist);

    const result = await getDentist(
      { user_id: mockDentist },
      dataPayload.requestInfo
    );

    expect(result).toEqual(mockDentist);

    findByIdMock.mockRestore();
  });

  it("should return Invalid user ID", async () => {
    const mockDentistId = "dentistId";
    const mockDentist = { _id: mockDentistId };

    const dataPayload = {
      payload: mockDentist,
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

    const findByIdMock = jest.spyOn(DentistSchema, "findById");
    findByIdMock.mockResolvedValue(null);

    await expect(
      getDentist(dataPayload.payload, dataPayload.requestInfo)
    ).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Invalid user ID",
      })
    );
  });
});
