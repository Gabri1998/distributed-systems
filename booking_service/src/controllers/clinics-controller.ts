import clinicSchema, { Clinic } from "../schemas/clinics";
import { MessageException } from "../exceptions/MessageException";
import { MessageHandler, RequestInfo } from "../utilities/types-utils";
import { createPosition } from "../utilities/position-utils";

//Method for admin access check
export const checkAdminAccess = (requestInfo: RequestInfo) => {
  if (!requestInfo.user?.admin) {
    throw new MessageException({
      code: 403,
      message: "Forbidden. Only admins can perform this action.",
    });
  }
};

//creating a clinic- POST
export const createClinic: MessageHandler = async (data, requestInfo) => {
  // Check if the user is an admin
  checkAdminAccess(requestInfo);

  const { clinicName, address, workingDentists = [] } = data;

  // validate the data of the patient clinicName: address: workingDentists:
  if (!clinicName || !address) {
    throw new MessageException({
      code: 422,
      message:
        "Input missing data, All input fields are required to be filled.", // testable
    });
  }

  // find a registered Clinic in DB
  const registeredClinic = await clinicSchema.find({ clinicName, address });
  // check if clinic already registered in DB
  if ((await registeredClinic).length > 0) {
    throw new MessageException({
      code: 422,
      message: "Clinic already exists", // testable
    });
  }
  // Create a new clinic
  const newClinic = new clinicSchema({
    clinicName,
    address,
    position: await createPosition(address),
    workingDentists,
  });

  // Save the clinic to the database
  await newClinic.save();
  return newClinic;
};

//getting all clinics- GET
export const getAllClinics: MessageHandler = async (data) => {
  try {
    const allClinics = await clinicSchema.find({});

    // Check if any clinic exists
    if (allClinics.length > 0) {
      return allClinics;
    } else {
      throw new MessageException({
        code: 404,
        message: "No clinic found",
      });
    }
  } catch (error) {
    throw new MessageException({
      code: 500,
      message: "Failed to find clinics", // testable
    });
  }
};

// getting Clinic with a specific id- GET/:id
export const getClinic: MessageHandler = async (data) => {
  const { clinic_id } = data;
  const clinic = await clinicSchema.findById(clinic_id);

  if (!clinic) {
    throw new MessageException({
      code: 404,
      message: "Not found. Clinic does not exists.", // testable
    });
  }

  return  clinic ;
};

// updateClinic fields -PATCH
export const updateClinic: MessageHandler = async (data, requestInfo) => {
  const { clinic_id, clinicName, address, workingDentists = [] } = data;

  // Check if the user is an admin
  checkAdminAccess(requestInfo);

  // Check if clinicUpdates is provided and not empty
  if (!clinicName || !address) {
    throw new MessageException({
      code: 422,
      message:
        "Input missing data, All input fields are required to be filled.", // testable
    });
  }

  // Check if the clinic with the given ID exists
  const existingClinic = await clinicSchema.findById(clinic_id);
  if (!existingClinic) {
    throw new MessageException({
      code: 400,
      message: "Not found. Clinic not found", // testable
    });
  }

  // Perform the partial update
  const updatedClinic = await clinicSchema.findByIdAndUpdate(
    clinic_id,
    { clinicName, address, workingDentists: [] },
    { new: true, runValidators: true }
  );

  if (!updatedClinic) {
    throw new MessageException({
      code: 500,
      message: "Internal Server Error. Failed to update clinic",
    });
  }

  return updatedClinic;
};

// delete clinic with a specific ID
export const deleteClinic: MessageHandler = async (data, requestInfo) => {
  const { clinic_id } = data;

  // Check if the user is an admin
  checkAdminAccess(requestInfo);

  const clinic = await clinicSchema.findByIdAndDelete(clinic_id);

  if (!clinic) {
    throw new MessageException({
      code: 404,
      message: "Not found. Clinic does not exist.", // testable
    });
  }
  return `Clinic deleted successfully.`;
};

//Delete all clinics method
export const deleteAllClinics: MessageHandler = async (data, requestInfo) => {
  // Check if the user is an admin
  checkAdminAccess(requestInfo);

  const result = await clinicSchema.deleteMany(data);

  if (clinicSchema === null) {
    throw new MessageException({
      code: 500,
      message: "Database is already empty", // testable
    });
  }

  return `Deleted ${result.deletedCount} clinics`;
};

export default {
  createClinic,
  getAllClinics,
  getClinic,
  updateClinic,
  deleteClinic,
  deleteAllClinics,
};
