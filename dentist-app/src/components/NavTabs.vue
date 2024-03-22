<template>
  <nav class="navtab">

<div class="right-links">
  
    <b-dropdown v-if="!store?.getters.dentist">
      <template #button-content>
        <span class="account-button">Account</span>
      </template>
      <b-dropdown-item to="/login">LogIn</b-dropdown-item>
    
      
    </b-dropdown>
    
    <b-dropdown v-if="store?.getters.dentist">
      <template #button-content>
        <span class="account-button">Account</span>
      </template>
      <b-dropdown-item v-if="!store?.getters.dentist.admin" to="/create-slots">Slots Management</b-dropdown-item>
      <b-dropdown-item v-if="!store?.getters.dentist.admin" to="/create-emergencySlot">Emergency Slots Management</b-dropdown-item>
      <b-dropdown-item v-if="store?.getters.dentist.admin" to="/signup">Create Dentist</b-dropdown-item>
      <b-dropdown-item v-if="store?.getters.dentist.admin" to="/registerClinic">Create Clinic</b-dropdown-item>
      <b-dropdown-item to="/account">Account</b-dropdown-item>
      <b-dropdown-item v-if="!store?.getters.dentist.admin" to="/home">Home</b-dropdown-item>
      <b-dropdown-item  @click="handleLogout">logout</b-dropdown-item>
    </b-dropdown>

      </div>
  </nav>
</template>

<script>
import { mapGetters, useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { disConnect, connect } from '../ws'
import {getDentistInfo} from '../apis/dentists'
import Error from '../components/Error.vue'
export default {
  name: 'nav-tabs',
   

  data() {
    return {
      
       token:false,
       store:null,
       dentistDetails:null,
       router:null
    }
  },
  async mounted()  {
      this.store = useStore()
      this.router = useRouter()
      const route = useRoute()
      
      this.token = localStorage.getItem('token')
      if ((this.token) ) {
        this.dentistDetails = await getDentistInfo()
      this.store.dispatch('dentist', this.dentistDetails)
      connect(this.dentistDetails.id)

      if(this.dentistDetails.admin){
        this.$router.push('/account')
      }else{
        this.$router.push('/home')
      }
      
      } else if ((!this.token) && ![ '/login'].includes(route.path)) {
        this.router.push('/login')
      }

     
   /*    defineDentist().then((dentistDetails) => {
        
        connect(dentistDetails.id)
       
    }).catch(error=>{console.log(error)});
 */
    },

    methods:{

      handleLogout :function () {
        
      disConnect()
      localStorage.removeItem('token')
      this.store.dispatch('dentist', null)
      this.dentistDetails=null;
      this.router.push('/login')
      disConnect()
    },
    ...mapGetters(['dentist'])

    },
  
   

    

    /* const defineDentist = async () => {
      const dentistDetails = await getDentistInfo()
      this.store.dispatch('dentist', dentistDetails)
      return dentistDetails
    } */

   
  /* computed: {
    ...mapGetters(['dentist'])
  } */
}
</script>



<style scoped>
.navtab {
  display: flex;
  align-items: center;
  justify-content:space-between;
  margin: 10px;
}


.left-links {
  display: flex;
  align-items: center;
}

.right-links {
  display: flex;
  align-items: center;
  position: relative; /* Adjusted to relative positioning */
}

.account-dropdown {
  position: absolute;
  top: 0;
  right: 0;
}

.tab {
  color: rgba(255, 255, 255, 0.831);
  transition: color 0.3s ease; 
  text-decoration: none; 
  padding: 2%; 
}

.tab:hover {
  color: rgb(155, 155, 155); 
}
</style>