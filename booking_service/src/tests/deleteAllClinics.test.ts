import { deleteAllClinics } from "../controllers/clinics-controller";
import { MessageException } from "../exceptions/MessageException";
import ClinicSchema from "../schemas/clinics";

jest.mock("../schemas/clinics");

describe("deleteAllClinics", () => {
  it("should throw MessageException with code 500 for database error", async () => {
    const deleteManyMock = jest.spyOn(ClinicSchema, "deleteMany");
    deleteManyMock.mockRejectedValue(new Error("Database is already empty"));

    const requestInfo = {
      user: {
        id: "adminUserId",
        email: "admin@example.com",
        userType: "admin",
        admin: true,
        clinic_id: "adminClinicId",
      },
      requestID: "adminRequestId",
    };

    await expect(deleteAllClinics({}, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 500,
        message: "Database is already empty",
      })
    );

    deleteManyMock.mockRestore();
  });
});
