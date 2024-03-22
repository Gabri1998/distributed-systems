import { Api } from './api'


export const getClinics = async () => {
  const response = await Api().get('clinics')
  
  return response.data
}


export const createClinic = async (clinicName,address) => {
  const response = await Api().post('clinics',{
     
    clinicName : clinicName,
    address :address,
  
  })
  return response.data 
}

export const createSlots = async (start,end,duration,dentist_id,clinic_id) => {
  const response = await Api().post('slots/many',{
     
  start : start,
  end :end,
  duration:duration,
  dentist_id:dentist_id,
  clinic_id:clinic_id
  })
  return response.data 
}


export const getSlots = async () => {
  const response = await Api().get('slots')
  
  return response.data
}


export const deleteSlot=async(slot_id)=>{
    
  const response = await Api().delete(`slots/${slot_id}`)
  
  return response.data}

export const book=async(slot_id,patient_id)=>{
    
    const response = await Api().post(`slots/${slot_id}/book`, {
        booked:true,
        slot_id:slot_id,
        patient_id:patient_id
      })
    
    return response.data}

    
export const unBook=async(slot_id)=>{
    
    const response = await Api().post(`slots/${slot_id}/unbook`, {
       booked:false 
      })
    
    return response.data
  }

  