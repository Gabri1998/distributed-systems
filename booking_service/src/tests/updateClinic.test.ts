import { updateClinic } from "../controllers/clinics-controller";
import { MessageException } from "../exceptions/MessageException";
import ClinicSchema from "../schemas/clinics";

jest.mock("../schemas/clinics");

describe("updateClinic", () => {
  it("should return Input missing data, All input fields are required to be filled.", async () => {
    const noClinicName = { address: "exampleAddress" };

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

    await expect(updateClinic(noClinicName, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 422,
        message:
          "Input missing data, All input fields are required to be filled.",
      })
    );
  });

  it("should return Forbidden. Only admins can perform this action.", async () => {
    const exampleClinic = {
      clinicName: "exampleClinicName",
      address: "exampleAddress",
    };

    const requestInfo = {
      user: {
        id: "someUserId",
        email: "user@example.com",
        userType: "notAdmin",
        admin: false,
        clinic_id: "000000",
      },
      requestID: "someRequestId",
    };

    await expect(updateClinic(exampleClinic, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 422,
        message: "Forbidden. Only admins can perform this action.",
      })
    );
  });

  it("should return Not found. Clinic not found", async () => {
    const exampleCLinic = {
      clinic_id: "exampleClinicId",
      clinicName: "exampleClinicName",
      address: "exampleAddress",
    };

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

    const mockFindById = jest.spyOn(ClinicSchema, "findById");
    mockFindById.mockResolvedValue(null);

    await expect(updateClinic(exampleCLinic, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Not found. Clinic not found",
      })
    );

    mockFindById.mockRestore();
  });
});
