import SlotSchema, { Slot } from "../schemas/slots";
import { MessageException } from "../exceptions/MessageException";
import { MessageHandler } from "../utilities/types-utils";
import { isBefore, addMinutes } from "date-fns";
import mongoose, { FilterQuery } from "mongoose";

export const createSlots: MessageHandler = async (data, requestInfo) => {
  if (requestInfo.user?.userType !== "dentist") {
    throw new MessageException({
      code: 403,
      message: "Forbidden",
    });
  }

  if (!requestInfo.user?.clinic_id) {
    throw new MessageException({
      code: 403,
      message:
        "To be able to create a slot, you have to be assigned to a clinic",
    });
  }

  const { start, end, duration } = data as {
    start?: string;
    end?: string;
    duration?: number;
  };

  // validate the data of the slot
  if (!start || !end || !duration) {
    // throw
    throw new MessageException({
      code: 403,
      message: "Input missing data, All data required",
    });
  }

  const clinic_id = requestInfo.user.clinic_id;
  const dentist_id = requestInfo.user.id;

  const step = (x) => addMinutes(x, duration);

  let cursor = new Date(start);

  while (isBefore(cursor, new Date(end))) {
    // find a registered slot in DB
    const registeredSlot = SlotSchema.find({
      start: cursor,
      clinic_id,
      dentist_id,
    });

    // check if slot already registered in DB
    if ((await registeredSlot).length > 0) {
      throw new MessageException({
        code: 403,
        message: "Slot already exists for that time",
      });
    }

    const slot = new SlotSchema({
      start: cursor,
      end: step(cursor),
      booked: false,
      dentist_id,
      clinic_id,
    });

    slot.save();
    cursor = step(cursor);
  }
  return "Created";
};

export const createSlot: MessageHandler = async (data, requestInfo) => {
  if (requestInfo.user?.userType !== "dentist") {
    throw new MessageException({
      code: 403,
      message: "Forbidden",
    });
  }

  if (!requestInfo.user?.clinic_id) {
    throw new MessageException({
      code: 403,
      message:
        "To be able to create a slot, you have to be assigned to a clinic",
    });
  }

  const { start, end } = data;

  // validate the data of the slot
  if (!start || !end) {
    // throw
    throw new MessageException({
      code: 403,
      message: "Input missing data, All data required",
    });
  }

  const clinic_id = requestInfo.user.clinic_id;
  const dentist_id = requestInfo.user.id;

  // find a registered slot in DB
  const registeredSlot = SlotSchema.find({ start, end, clinic_id, dentist_id });

  // check if slot already registered in DB
  if ((await registeredSlot).length > 0) {
    throw new MessageException({
      code: 403,
      message: "Slot already exists for that time",
    });
  }

  const slot = new SlotSchema({
    start,
    end,
    booked: false,
    dentist_id,
    clinic_id,
  });

  slot.save();

  return slot;
};
export const getClinicSlots: MessageHandler = async (data) => {
  let query: FilterQuery<Slot> = {};
  query = { clinic_id: data.clinic_id };

  const slots = await SlotSchema.find(query);
  if (!slots) {
    throw new MessageException({
      code: 400,
      message: "Invalid clinic ID",
    });
  }

  if (slots === null) {
    throw new MessageException({
      code: 400,
      message: "Slot within that clinic does not exist",
    });
  }
  return slots;
};

export const getDentistSlots: MessageHandler = async (data) => {
  let query: FilterQuery<Slot> = {};
  query = { dentist_id: data.dentist_id };

  const slots = await SlotSchema.find(query);
  if (!slots) {
    throw new MessageException({
      code: 400,
      message: "Invalid dentist id",
    });
  }

  if (slots === null) {
    throw new MessageException({
      code: 400,
      message: "Slot  that dentist does not exist",
    });
  }
  return slots;
};

export const getSlot: MessageHandler = async (data, requestInfo) => {
  const { slot_id } = data;
  const slot = await SlotSchema.findById(slot_id);

  if (!slot) {
    throw new MessageException({
      code: 400,
      message: "Invalid slot ID",
    });
  }

  if (slot === null) {
    throw new MessageException({
      code: 400,
      message: "Slot does not exist",
    });
  }

  return slot;
};

//Get all slots
const getPatientSlots: MessageHandler = async (data, requestInfo) => {
  let query: FilterQuery<Slot> = {};
  if (requestInfo.user?.userType == "patient") {
    query = {
      patient_id: data.patient_id,
    };
  }

  const slots = await SlotSchema.find(query);

  if (!slots) {
    throw new MessageException({
      code: 400,
      message: "No slots have been booked", //can there really be an invalid slot id if we are getting all slots?
    });
  }

  if (slots === null) {
    throw new MessageException({
      code: 400,
      message: "No booking", //we may have to get rid of both errors since a user might have no slots booked
    });
  }
  return slots;
};

export const getSlots: MessageHandler = async (data, requestInfo) => {
  let query: FilterQuery<Slot> = {};
  if (requestInfo.user?.userType == "dentist") {
    query = {
      dentist_id: requestInfo.user.id,
    };
  }

  const slots = await SlotSchema.find(query);

  if (!slots) {
    throw new MessageException({
      code: 400,
      message: "Invalid slot ID", // testable
    });
  }

  if (slots === null) {
    throw new MessageException({
      code: 400,
      message: "Slot does not exist", // TODO: create test
    });
  }
  return slots;
};

// updateSlot fields -PATCH
export const updateSlot: MessageHandler = async (data, requestInfo) => {
  if (requestInfo.user?.userType !== "dentist") {
    throw new MessageException({
      code: 403,
      message: "Forbidden. Only dentists can perform this action.",
    });
  }
  const { slot_id, start, end, dentistId, clinic_id } = data;
  console.log("slotID", slot_id);
  // Check if the slot with the given ID exists
  const existingSlot = await SlotSchema.findById(slot_id);
  if (!existingSlot) {
    throw new MessageException({
      code: 400,
      message: "Slot not found",
    });
  }

  // Check if slotUpdates that's provided and not empty
  if (!start || !end || !dentistId || !clinic_id) {
    throw new MessageException({
      code: 422,
      message:
        "Input missing data, All input fields are required to be filled.",
    });
  }

  // Perform the partial update
  const updatedSlot = await SlotSchema.findByIdAndUpdate(
    slot_id,
    { start, end, dentist_id: dentistId, clinic_id },
    { new: true, runValidators: true }
  );

  if (!updatedSlot) {
    throw new MessageException({
      code: 500,
      message: "Failed to update slot",
    });
  }

  return updatedSlot;
};

// delete slot with a specific ID
export const deleteSlot: MessageHandler = async (data) => {
  const { slot_id } = data;

  const slot = await SlotSchema.findByIdAndDelete(slot_id);

  if (!slot) {
    throw new MessageException({
      code: 400,
      message: "Invalid id",
    });
  }

  if (slot === null) {
    throw new MessageException({
      code: 400,
      message: "Slot does not exist",
    });
  }
  return "Slot deleted";
};

export const bookSlot: MessageHandler = async (
  data: { slot_id?: string; patient_id?: string },
  requestInfo
) => {
  var { slot_id, patient_id } = data;

  if (requestInfo.user?.userType == "patient") {
    patient_id = requestInfo.user?.id;
  } else if (requestInfo.user?.userType !== "dentist") {
    throw new MessageException({
      code: 403,
      message: "Forbidden",
    });
  }

  if (!slot_id || !patient_id) {
    throw new MessageException({
      code: 400,
      message: "missing input needs to be specified",
    });
  }

  // verify it's a real object id
  if (
    !mongoose.Types.ObjectId.isValid(slot_id) ||
    !mongoose.Types.ObjectId.isValid(patient_id)
  ) {
    throw new MessageException({
      code: 400,
      message: "Valid patient/slot ID needs to be specified",
    });
  }

  const slotData = await SlotSchema.findById(slot_id);
  if (slotData?.booked) {
    throw new MessageException({
      code: 400,
      message: "Forbidden, Slot already booked",
    });
  }

  const slot = await SlotSchema.findByIdAndUpdate(
    slot_id,
    {
      booked: true,
      patient_id: patient_id,
    },
    { new: true }
  );

  // checks description and booking type are not null

  if (!slot) {
    throw new MessageException({
      code: 404,
      message: "Slot not found for update",
    });
  }
  return slot;
};

export const unBookSlot: MessageHandler = async (
  data: { slot_id?: string },
  requestInfo
) => {
  const { slot_id } = data;

  if (!slot_id) {
    throw new MessageException({
      code: 400,
      message: "slot_id needs to be specified",
    });
  }

  // verify it's a real object id
  if (!mongoose.Types.ObjectId.isValid(slot_id)) {
    throw new MessageException({
      code: 400,
      message: "Valid patient/slot ID needs to be specified",
    });
  }

  const slotData = await SlotSchema.findById(slot_id);

  if (!slotData) {
    throw new MessageException({
      code: 404,
      message: "Slot not found for update",
    });
  }

  if (
    requestInfo.user?.userType == "dentist" &&
    requestInfo.user?.id !== slotData?.dentist_id
  ) {
    throw new MessageException({
      code: 400,
      message: "Forbidden action, slot belong to another dentist",
    });
  } else if (
    requestInfo.user?.userType == "patient" &&
    requestInfo.user?.id !== slotData?.patient_id
  ) {
    throw new MessageException({
      code: 400,
      message: "Forbidden action",
    });
  } else if (requestInfo.user?.userType == "admin") {
    throw new MessageException({
      code: 400,
      message: "Forbidden action",
    });
  }
  // booked = false;
  const slot = await SlotSchema.findByIdAndUpdate(
    slot_id,
    {
      booked: false,
      patient_id: null,
    },
    { new: true }
  );

  return slotData;
};

const deletePatientSlots: MessageHandler = async (data, requestInfo) => {
  let query: FilterQuery<Slot> = {};

  query = {
    patient_id: data.patient_id ? data.patient_id : requestInfo.user?.id,
  };

  if (query.patient_id == null) {
    throw new MessageException({
      code: 400,
      message: "no patient id provided ",
    });
  }
  await SlotSchema.deleteMany(query);

  return "All slots for that patient has been deleted";
};

export const deleteAllSlots: MessageHandler = async (data, requestInfo) => {
  if (requestInfo.user?.userType !== "dentist") {
    throw new MessageException({
      code: 403,
      message: "Forbidden",
    });
  }

  if (SlotSchema.length >= 1) {
    await SlotSchema.deleteMany(data);
    return "All Slots deleted";
  } else {
    throw new MessageException({
      code: 400,
      message: "Database already empty",
    });
  }
};

export default {
  createSlots,
  createSlot,
  getSlot,
  getSlots,
  getClinicSlots,
  getDentistSlots,
  getPatientSlots,
  updateSlot,
  deleteSlot,
  bookSlot,
  unBookSlot,
  deleteAllSlots,
  deletePatientSlots,
};
