import { Api } from './api'

export const getClinics = async () => {
  const response = await Api().get('clinics')

  return response.data
}

export const getDentists = async () => {
  const response = await Api().get('dentists')

  return response.data
}

export const getClinicDentists = async (clinicId) => {
  console.log('getClinicDentists: clinic id ' + clinicId)
  const response = await Api().get(`dentists/clinic/${clinicId}`)

  return response.data
}
