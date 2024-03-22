import { Api } from './api'

export const getDentistSlots = async (dentistId) => {
  const response = await Api().get(`slots/dentist/${dentistId}`)

  return response.data
}


export const getUserBookings = async (patient_id) => {
  const response = await Api().get(`slots/patient/${patient_id}`)

  return response.data
}

export const getSlot = async (slot_id) => {
  const response = await Api().get(`slots/${slot_id}`)

  return response.data
}

export const book = async (slot_id, userId) => {
  const response = await Api().post(`slots/${slot_id}/book`, { userId, booked: true })

  return response.data
}

export const unBook = async (slot_id) => {
  const response = await Api().post(`slots/${slot_id}/unbook`, { userId: null, booked: false })

  return response.data
}
