import { Api } from './api'

export const createDentist = async (firstName, lastName, SSN, email, password,admin,clinic_id) => {
  const response = await Api().post('dentists', {
    firstName: firstName,
    lastName: lastName,
    SSN: SSN,
    email: email,
    password:  password,
    admin: admin,
    clinic_id:clinic_id
    
  })
  return response.data
}

export const login = async (ssn, email, password) => {
  const response = await Api().post('dentists/login', {
    SSN: ssn,
    email: email,
    password: password
  })

  return response.data.token
}

export const getDentistInfo = async () => {
  const response = await Api().get('me')

  return response.data
}

export const updateDentist = async (user_id, firstName, lastName, email, password) => {
  const response = await Api().put(`dentists/${user_id}`, {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password
  })

  return response.data
}

export const deleteDentist = async (user_id) => {
  const response = await Api().delete(`dentists/${user_id}`)
  return response.data
}

export const getDentists = async () => {
  const response = await Api().get('dentists')
  return response.data
}
