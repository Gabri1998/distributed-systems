import { getClinicSlots } from "../controllers/slots-controller";
import { MessageException } from "../exceptions/MessageException";
import SlotSchema from "../schemas/slots";

jest.mock("../schemas/slots");

(SlotSchema.find as jest.Mock) = jest.fn();

describe("getClinicSlots", () => {
  it("should throw an exception for an invalid clinic ID", async () => {
    const testData = { clinic_id: "invalidClinicId" };

    const requestInfo = {
      user: {
        id: "someUserId",
        email: "user@example.com",
        userType: "dentist",
        admin: true,
        clinic_id: "000000",
      },
      requestID: "someRequestId",
    };

    (SlotSchema.find as jest.Mock).mockResolvedValueOnce(null);

    await expect(getClinicSlots(testData, requestInfo)).rejects.toThrow(
      "Invalid clinic ID"
    );
  });
});
