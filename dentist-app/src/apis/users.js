import { Api } from './api'

export const login = async ( email) => {
    const response = await Api().post('users/', {email})
    return response.data.token}

export const getUsers = async (email) => {
    const response = await Api().get(`users?email=${email}`)
 
    return response.data
}

export const getUser = async (patient_id) => {
    const response = await Api().get(`users/${patient_id}`)
    if(!response||response==null){
        return undefined
     }
    return response.data
}