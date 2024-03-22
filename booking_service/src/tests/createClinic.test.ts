import { createClinic } from "../controllers/clinics-controller";
import { MessageException } from "../exceptions/MessageException";
import ClinicSchema from "../schemas/clinics";

jest.mock("../schemas/clinics");

describe("createCLinic", () => {
  it("should throw Input missing, All input fields are required to be filled.", async () => {
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

    await expect(createClinic(exampleClinic, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 422,
        message:
          "Input missing data, All input fields are required to be filled.",
      })
    );
  });

  it("should throw Clinic already exists", async () => {
    const exampleClinic = {
      clinicName: "exampleClinic",
      address: "exampleAddress",
    };
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
    findMock.mockResolvedValue([
      { clinicName: "exampleClinic", address: "exampleAddress" },
    ]);

    await expect(createClinic(exampleClinic, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 422,
        message: "Clinic already exists",
      })
    );

    findMock.mockRestore();
  });
});
