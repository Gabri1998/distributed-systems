import { deleteAllSlots } from "../controllers/slots-controller";
import { MessageException } from "../exceptions/MessageException";
import SlotSchema from "../schemas/slots";

jest.mock("../schemas/slots");

describe("deleteAllSlots", () => {
  it("should throw Forbidden", async () => {
    const mockSlotId = "000000";
    const mockSlot = {
      slot_id: mockSlotId,
    };

    const requestInfo = {
      user: {
        id: "someUserId",
        email: "user@example.com",
        userType: "notDentist",
        admin: false,
      },
      requestID: "someRequestID",
    };

    await expect(deleteAllSlots(mockSlot, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Forbidden",
      })
    );
  });

  it("should throw Database already empty", async () => {
    const deleteManyMock = jest.spyOn(SlotSchema, "deleteMany");
    deleteManyMock.mockRejectedValue(new Error("Database already empty"));

    const requestInfo = {
      user: {
        id: "adminUserId",
        email: "admin@example.com",
        userType: "dentist",
        admin: true,
        clinic_id: "adminClinicId",
      },
      requestID: "adminRequestId",
    };

    await expect(deleteAllSlots({}, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "Database already empty",
      })
    );

    deleteManyMock.mockRestore();
  });
});
