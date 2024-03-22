import { updateSlot } from "../controllers/slots-controller";
import { MessageException } from "../exceptions/MessageException";
import SlotSchema from "../schemas/slots";

jest.mock("../schemas/slots");

describe("updateSlot", () => {
  it("should return Forbidden. Only admins can perform this action.", async () => {
    const data = { slot_id: "slotId" };
    const requestInfo = {
      user: {
        id: "someUserId",
        email: "user@example.com",
        userType: "notdentist",
        admin: true,
        clinic_id: "000000",
      },
      requestID: "someRequestId",
    };

    await expect(updateSlot(data, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Forbidden. Only dentists can perform this action.",
      })
    );
  });

  it("should return slot not found", async () => {
    const mockSlotId = { slot_id: "slotId" };
    const mockSlot = { slot_id: mockSlotId };

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

    await expect(updateSlot(mockSlot, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Slot not found",
      })
    );

    findByIdMock.mockRestore();
  });

  it("should return Input missing data, All input fields are required to be filled.", async () => {
    const updateInfo = {
      slot_id: "123456",
    };
    const existingSlotId = { slot_id: "123456" };
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

    const findByIdSpy = jest.spyOn(SlotSchema, "findById");
    findByIdSpy.mockResolvedValue([{ existingSlot: existingSlotId }]);

    await expect(updateSlot(updateInfo, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 422,
        message:
          "Input missing data, All input fields are required to be filled.",
      })
    );

    expect(findByIdSpy).toHaveBeenCalledWith(updateInfo.slot_id);
    findByIdSpy.mockRestore();
  });

  it("should return Failed to update slot", async () => {
    const updateInfo = {
      slot_id: "123456",
      start: "2023-12-31",
      end: "2023-12-31",
      dentistId: "000000",
      clinic_id: "000000",
    };
    const existingSlotId = { slot_id: "123456" };
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

    const findByIdSpy = jest.spyOn(SlotSchema, "findById");
    findByIdSpy.mockResolvedValue([{ existingSlot: existingSlotId }]);

    await expect(updateSlot(updateInfo, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 500,
        message: "Failed to update slot",
      })
    );

    findByIdSpy.mockRestore();
  });
});
