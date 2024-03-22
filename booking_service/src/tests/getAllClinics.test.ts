import { getAllClinics } from "../controllers/clinics-controller";
import { MessageException } from "../exceptions/MessageException";
import ClinicSchema from "../schemas/clinics";

jest.mock("../schemas/clinics");

describe("getAllClinic", () => {
  it("should return all clinics when clinics are found", async () => {
    const findSpy = jest.spyOn(ClinicSchema, "find");
    findSpy.mockResolvedValue([{ clinicId: "123", name: "Clinic A" }]);

    const requestInfo = {
      user: {
        id: "someUserId",
        email: "user@example.com",
        userType: "notDentist",
        admin: true,
        clinic_id: "000000",
      },
      requestID: "someRequestId",
    };

    const result = await getAllClinics({}, requestInfo);

    expect(result).toEqual([{ clinicId: "123", name: "Clinic A" }]);
  });

  it("should throw Failed to find clinics", async () => {
    const exampleClinic = { clinicName: "exampleClinic" };
    const requestInfo = {
      user: {
        id: "someUserId",
        email: "user@example.com",
        userType: "notDentist",
        admin: true,
        clinic_id: "000000",
      },
      requestID: "someRequestId",
    };

    const findMock = jest.spyOn(ClinicSchema, "find");
    findMock.mockResolvedValue([]);

    await expect(getAllClinics(exampleClinic, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 500,
        message: "Failed to find clinics",
      })
    );

    findMock.mockRestore();
  });
});
