import { getSlot } from "../controllers/slots-controller";
import { MessageException } from "../exceptions/MessageException";
import SlotSchema from "../schemas/slots";

jest.mock("../schemas/slots");

describe("getSlots", () => {
  it("should throw invalid slot ID", async () => {
    const testData = { slot_id: "slotId" };

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

    const findByIdMock = jest.spyOn(SlotSchema, "findById");
    findByIdMock.mockResolvedValue(null);

    await expect(getSlot(testData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Invalid slot ID",
      })
    );
    findByIdMock.mockRestore();
  });
});
