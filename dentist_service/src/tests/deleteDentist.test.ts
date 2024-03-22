import { deleteDentist } from "../controllers/dentists-controller";
import { MessageException } from "../exceptions/MessageException";
import DentistSchema from "../schemas/dentists";

jest.mock("../schemas/dentists");

describe("deleteDentist", () => {
  it("should deleteDentist", async () => {
    const mockDentistId = "dentistId";
    const mockDentist = { _id: mockDentistId };

    const dataPayload = {
      payload: mockDentist,
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

    const findByIdAndDeleteSpy = jest.spyOn(DentistSchema, "findByIdAndDelete");
    findByIdAndDeleteSpy.mockResolvedValueOnce(mockDentist);

    const result = await deleteDentist(
      { user_id: mockDentist },
      dataPayload.requestInfo
    );

    expect(result).toBe("Dentist has been deleted");

    findByIdAndDeleteSpy.mockRestore();
  });

  it("should return invalid id", async () => {
    const mockDentistId = "dentistId";
    const mockDentist = { _id: mockDentistId };

    const dataPayload = {
      payload: mockDentist,
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

    const findByIdAndDeleteSpy = jest.spyOn(DentistSchema, "findByIdAndDelete");
    findByIdAndDeleteSpy.mockRejectedValueOnce(new Error("Invalid Id"));

    await expect(
      deleteDentist({ user_id: mockDentistId }, dataPayload.requestInfo)
    ).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Invalid Id",
      })
    );

    findByIdAndDeleteSpy.mockRestore();
  });

  /* Not testable
  it("should return forbidden", async () => {
    const mockDentistId = "dentistId";
    const mockDentist = { _id: mockDentistId };

    const dataPayload = {
      payload: { dentist_id: mockDentistId },
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

    const findByIdAndDeleteSpy = jest.spyOn(DentistSchema, "findByIdAndDelete");
    findByIdAndDeleteSpy.mockResolvedValueOnce(mockDentist);

    const result = await deleteDentist(
      dataPayload.payload,
      dataPayload.requestInfo
    );
    expect(result).toBe("Dentist has been deleted");

    expect(findByIdAndDeleteSpy).toHaveBeenCalledWith(mockDentistId);

    await expect(
      deleteDentist(dataPayload.payload, dataPayload.requestInfo)
    ).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Forbidden",
      })
    );

    findByIdAndDeleteSpy.mockRestore();
  });
  **/
});
