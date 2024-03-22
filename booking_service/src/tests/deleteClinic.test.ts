import { deleteClinic } from "../controllers/clinics-controller";
import { MessageException } from "../exceptions/MessageException";
import ClinicSchema from "../schemas/clinics";

jest.mock("../schemas/clinics");

describe("deleteClinic", () => {
  it("should return Not found. Clinic does not exist.", async () => {
    const notExistingClinic = { clinic_id: "I am a Ghost" };

    const requestInfo = {
      user: {
        id: "someUserId",
        email: "admin@example.com",
        userType: "anAdmin",
        admin: true,
        clinic_id: "000000",
      },
      requestID: "someRequestId",
    };

    const findByIdAndDeleteMock = jest.spyOn(ClinicSchema, "findByIdAndDelete");
    findByIdAndDeleteMock.mockResolvedValue(null);

    await expect(deleteClinic(notExistingClinic, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 404,
        message: "Not found. Clinic does not exist.",
      })
    );

    findByIdAndDeleteMock.mockRestore();
  });

  it("should delete the clinic if all conditions are met.", async () => {
    const existingClinic = { clinic_id: "I am not a Ghost" };

    const requestInfo = {
      user: {
        id: "someUserId",
        email: "admin@example.com",
        userType: "anAdmin",
        admin: true,
        clinic_id: "000000",
      },
      requestID: "someRequestId",
    };

    const findByIdAndDeleteMock = jest.spyOn(ClinicSchema, "findByIdAndDelete");
    findByIdAndDeleteMock.mockResolvedValue(existingClinic);

    const result = await deleteClinic(existingClinic, requestInfo);

    expect(result).toBe("Clinic deleted successfully.");

    findByIdAndDeleteMock.mockRestore();
  });
});
