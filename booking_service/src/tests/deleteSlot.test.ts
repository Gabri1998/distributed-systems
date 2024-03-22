import { deleteSlot } from "../controllers/slots-controller";
import { MessageException } from "../exceptions/MessageException";
import SlotSchema from "../schemas/slots";

jest.mock("../schemas/slots");

describe("deleteSlot", () => {
  it("should throw invalid id", async () => {
    const mockSlotId = "000000";
    const mockSlot = {
      slot_id: mockSlotId,
    };

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

    const findByIdAndDeleteMock = jest.spyOn(SlotSchema, "findByIdAndDelete");
    findByIdAndDeleteMock.mockResolvedValue(null);

    await expect(deleteSlot(mockSlot, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Invalid id",
      })
    );

    findByIdAndDeleteMock.mockRestore();
  });

  /* it("should throw Slot does not exist", async () => {
    const mockSlotId = "000000";
    const mockSlot = {
      slot_id: mockSlotId,
    };

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

    const findByIdAndDeleteMock = jest.spyOn(SlotSchema, "findByIdAndDelete");
    findByIdAndDeleteMock.mockResolvedValue(undefined); // Mocking the case where slot does not exist

    await expect(deleteSlot(mockSlot, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Slot does not exist",
      })
    );

    findByIdAndDeleteMock.mockRestore();
  });
  **/
});
