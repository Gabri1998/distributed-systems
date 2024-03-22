import { getClinicSlots } from "../controllers/slots-controller";
import { MessageException } from "../exceptions/MessageException";
import SlotSchema from "../schemas/slots";

jest.mock("../schemas/slots");

(SlotSchema.find as jest.Mock) = jest.fn();

describe("getClinicSlots", () => {
  it("should retrieve slots for a valid clinic ID", async () => {
    const clinicId = "validClinicId";
    const testData = { clinic_id: clinicId };

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

    const mockSlots = [{}];
    (SlotSchema.find as jest.Mock).mockResolvedValueOnce(mockSlots);

    const result = await getClinicSlots(testData, requestInfo);
    expect(SlotSchema.find as jest.Mock).toHaveBeenCalledWith({
      clinic_id: clinicId,
    });
    expect(result).toEqual(mockSlots);
  });

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

  /* it("should throw an exception if slots within that clinic do not exist", async () => {
    // Mock data for the test
    const testData = { clinic_id: "validClinicId" };
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

    // Mock the return value of SlotSchema.find
    (SlotSchema.find as jest.Mock).mockResolvedValueOnce([]);

    // Assertions
    await expect(getClinicSlots(testData, requestInfo)).rejects.toThrowError(
      new MessageException({
        code: 400,
        message: "Slot within that clinic does not exist",
      })
    );
  });
  **/
});
