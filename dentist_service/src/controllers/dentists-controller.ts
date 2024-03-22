import DentistSchema, { Dentist } from "../schemas/dentists";
import { MessageException } from "../exceptions/MessageException";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { MessageHandler,MessageData,RequestInfo } from "../utilities/types-utils";
import mongoose, { FilterQuery } from "mongoose";
const createDentist: MessageHandler = async (data,requestInfo) => {
  console.log("start",requestInfo.user);
  if(!requestInfo.user?.admin){
    throw new MessageException({
      code: 403,
      message: "Forbidden",
    });
  }

  const { firstName, lastName, SSN, email, password, admin, clinic_id } = data;

  // validate the data of the patient
  if (
    !(
      firstName &&
      lastName &&
      SSN &&
      email &&
      password &&
      typeof admin === "boolean"
    )
  ) {
    // throw
    throw new MessageException({
      code: 403,
      message: "Input missing data, All data required",
    });
  }

  // find a registered Dentist in DB
  const registeredDentist = DentistSchema.find({ SSN, email });

  // check if Dentist already registered in DB
  if ((await registeredDentist).length > 0) {
    throw new MessageException({
      code: 403,
      message: "Dentist already exists",
    });
  }

  if (!password) {
    throw new MessageException({
      code: 403,
      message: "Password is wrong",
    });
  }
  const passwordHash = await bcrypt.hash(`${password}`, 10);
  const dentist = new DentistSchema({
    firstName,
    lastName,
    SSN,
    email,
    password: passwordHash,
    admin,
    clinic_id,
  });

  dentist.save();

  return dentist;
};

// Dentist login
export const login: MessageHandler = async (data) => {
  const { SSN, email, password } = data;
  // Validate Dentist input
  if (typeof password != "string") {
    throw new MessageException({
      code: 400,
      message: "Invalid Data type",
    });
  }
  if (!((SSN || email) && password)) {
    throw new MessageException({
      code: 400,
      message: "All input is required",
    });
  }

  // Check if Dentist exist in our DB
  const dentist = await DentistSchema.findOne({ $or: [{ SSN }, { email }] });
  if (!dentist) {
    throw new MessageException({
      code: 404,
      message: "Invalid records",
    });
  }

  // if Dentist exists and passwords match
  if (!(await bcrypt.compare(password, dentist.password))) {
    throw new MessageException({
      code: 401,
      message: "Invalid records",
    });
  }
  return dentist;
};

const getAllDentists: MessageHandler = async (data, requestInfo) => {
  const dentists = await DentistSchema.find(data);

  if (DentistSchema === null) {
    throw new MessageException({
      code: 400,
      message: "DataBase is empty",
    });
  }

  return dentists;
};


const getDentist:MessageHandler =async  (data)=> {
  
  const {dentist_id}= data;
    const dentist = await DentistSchema.findById(dentist_id)

  if (!dentist) {
    throw new MessageException({
      code: 400,
      message: "Invalid user ID",
    });
  }

    if (dentist === null) {
      throw new MessageException({
        code: 400,
        message: 'User does not exist',
      })
    }

    return dentist
  }




  const getClinicDentists:MessageHandler =async  (data)=> {
  
    let query: FilterQuery<Dentist> = {};
  query = { clinic_id: data.clinic_id };

    
      const dentists = await DentistSchema.find(query)
  
      if (!dentists) {
        throw new MessageException({
          code: 400,
          message: 'Invalid clinic ID',
        })
      }
  
      if (dentists === null) {
        throw new MessageException({
          code: 400,
          message: 'Dentists does not exist',
        })
      }
  
      return dentists;
    }




// updates a dentist with given the ID
export const updateDentist: MessageHandler = async (data, requestInfo) => {
  if (!requestInfo.user?.admin) {
    throw new MessageException({
      code: 403,
      message: "Forbidden",
    });
  }
  const {
    dentist_id,
    firstName,
    lastName,
    SSN,
    email,
    admin,
    password,
    clinic_id,
  } = data;

  const existingDentist = await DentistSchema.findById(dentist_id);
  if (!existingDentist) {
    throw new MessageException({
      code: 400,
      message: " Dentist not found",
    });
  }

  if (
    !(
      firstName &&
      lastName &&
      SSN &&
      email &&
      password &&
      typeof admin === "boolean"
    )
  ) {
    // throw
    throw new MessageException({
      code: 403,
      message: "Input missing data, All data required",
    });
  }
  const passwordHash = await bcrypt.hash(`${password}`, 10);
  const dentist = await DentistSchema.findByIdAndUpdate(
    dentist_id,
    {
      firstName,
      lastName,
      SSN,
      email,
      admin,
      password: passwordHash,
      clinic_id,
    },
    { new: true }
  );
  return dentist;
};

// delete user with a specific ID
export const deleteDentist: MessageHandler = async (data, requestInfo) => {
  if (!requestInfo.user?.admin) {
    throw new MessageException({
      code: 403,
      message: "Forbidden",
    });
  }
  const { dentist_id } = data;

  const dentist = await DentistSchema.findByIdAndDelete(dentist_id);

  if (!dentist) {
    throw new MessageException({
      code: 400,
      message: "Invalid id",
    });
  }

  if (dentist === null) {
    throw new MessageException({
      code: 400,
      message: "Dentist does not exist",
    });
  }

  return "Dentist has been deleted";
};

const deleteAllDentists: MessageHandler = async (data, requestInfo) => {
  if (!requestInfo.user?.admin) {
    throw new MessageException({
      code: 403,
      message: "Forbidden",
    });
  }

  await DentistSchema.deleteMany(data);

  if (DentistSchema === null) {
    throw new MessageException({
      code: 400,
      message: "DataBase already empty",
    });
  }

  return "All Users deleted";
};


 




export default { createDentist, login,getDentist,updateDentist,deleteDentist,deleteAllDentists,getAllDentists,getClinicDentists};
