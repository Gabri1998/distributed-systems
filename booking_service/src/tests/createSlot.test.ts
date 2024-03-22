import { createSlot } from "../controllers/slots-controller";
import { MessageException } from "../exceptions/MessageException";
import SlotSchema from "../schemas/slots";

jest.mock("../schemas/slots");

describe("createSlot", () => {
  it("should throw Forbidden exception if user is not a dentist", async () => {
    const data = { start: "some start date", end: "some end date" };
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

    await expect(createSlot(data, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Forbidden",
      })
    );
  });

  it("should throw To be able to create a slot, you have to be assigned to a clinic", async () => {
    const data = { start: "some start date", end: "some end date" };
    const requestInfo = {
      user: {
        id: "someUserId",
        email: "user@example.com",
        userType: "dentist",
        admin: true,
      },
      requestID: "someRequestId",
    };

    await expect(createSlot(data, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message:
          "To be able to create a slot, you have to be assigned to a clinic",
      })
    );
  });

  it("should throw input missing data, all data required", async () => {
    const data = { start: "missing the end date!!" };

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

    await expect(createSlot(data, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Input missing data, All data required",
      })
    );
  });

  it("should throw slot already exists for that time", async () => {
    const data = { start: "some start date", end: "some end date" };

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

    const findSpy = jest.spyOn(SlotSchema, "find");
    findSpy.mockResolvedValue([{ existingSlot: "slot data" }]);

    await expect(createSlot(data, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Slot already exists for that time",
      })
    );

    findSpy.mockRestore();
  });
});
