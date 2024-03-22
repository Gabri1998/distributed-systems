<template>
<h1>This is your account</h1>


  <div class="div">
    
    <b-table  id="dentistDetails" :items="dentistDetails" :fields="fields"></b-table>
  </div >

  <div class="div" v-if="store?.getters.dentist?.admin">
    <h3>All Clinics Registered</h3>
    <b-table id="clinics" :items="clinics" :fields="clinicsFields"></b-table>
  </div>

  
  <div class="div" v-if="store?.getters.dentist?.admin">
    <h3>All Dentists/Admins Registered</h3>
    <b-table  id="dentists" :items="dentists" :fields="dentistsFields"></b-table>
  </div>

</template>


<script>
import { mapGetters, useStore } from 'vuex'
import {getClinics}  from '../apis/booking'
import {getDentists,getDentistInfo}  from '../apis/dentists'
export default {
  name: 'account',
   

  data() {
    return {
       store:null,
       dentistDetails:null,
       fields: ['firstName', 'lastName', 'email','admin','userType'],
       clinics:null,
       clinicsFields:['clinicName','address'],
       dentists:null,
       dentistsFields:['firstName', 'lastName', 'email','admin']
    }
  },
  async mounted()  {
      this.store = useStore()
     const currentDentist= await getDentistInfo()
      this.dentistDetails=currentDentist? [JSON.parse(JSON.stringify(currentDentist))]:[]
      console.log("over here" ,this.dentistDetails)

      this.clinics= await getClinics()
      this.dentists=await getDentists()
    },

    methods:{

      
    ...mapGetters(['dentist'])

    },
  
   
}
</script>

<style scoped>
.div{margin-top: 20px;}

</style>