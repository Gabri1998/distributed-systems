import { Api } from './api'

export const createEmergencySlot = async (start,end,dentist_id,clinic_id) => {
    const response = await Api().post('emergency-slots/create',{ 
    start : start,
    end :end,
    dentist_id:dentist_id,
    clinic_id:clinic_id
    })
    return response.data 
}

export const deleteEmergencySlot = async (emergencySlot_id) => {
    const response = await Api().delete(`emergency-slots/${emergencySlot_id}`)
    return response.data
}

export const getEmergencySlots = async (date) => {
    const response = await Api().get(`emergency-slots/${date}`, {
        date: date,
    })
    return response.data
}
