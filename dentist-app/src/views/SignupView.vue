<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="auth-wrapper">
        <div class="auth-inner">
          <div>
            <Error v-if="this.error!==''" :error="this.error"></Error>
            <h3>Add a Dentist</h3>
            <p>Welcome to Dentist sign up page!</p>
            <hr />
          </div>
         
          <form @submit.prevent="onSignUp()">
            <div class="form-group">
              <label>First Name</label>
              <input
                type="text"
                class="form-control"
                prepend-icon="ni ni-hat-3"
                placeholder="Jenny"
                v-model.trim="form.firstName"
                required
              />
            </div>

            <div class="form-group">
              <label>Last Name</label>
              <input
                type="text"
                class="form-control"
                placeholder="Kim"
                v-model.trim="form.lastName"
                required
              />
            </div>

            <div class="form-group">
              <label>SSN</label>
              <input
                type="text"
                minlength="5"
                maxlength="12"
                class="form-control"
                placeholder="987654-4321"
                v-model.trim="form.socialNumber"
                required
              />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                class="form-control"
                placeholder="jenny.kim@email.com"
                v-model.trim="form.email"
                required
              />
            </div>

            <div class="form-group">
              <label>Password</label>
              <input
                type="password"
                class="form-control"
                placeholder="*******"
                v-model.trim="form.password"
                required
              />
            </div>

            <div class="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                class="form-control"
                placeholder="*******"
                v-model.trim="form.confirmPassword"
                required
              />
            </div>
     
            <div class="admin">
           <input  type="checkbox" v-model="form.admin">
           <label>Admin</label>
            </div>
             
            
            <b-form-group label="Clinic" label-for="clinicDropdown" label-cols-md="2">
            <b-dropdown id="clinicDropdown" :text="selectedClinic?selectedClinic.clinicName: 'Select clinic' " block variant="primary" lazy>
              <b-dropdown-item-button v-for="clinic in allClinics" :key="clinic.id" @click="selectedClinic = clinic">{{ clinic.clinicName }}</b-dropdown-item-button>
            </b-dropdown>
          </b-form-group>

      
          
            <div class="my-3">
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Error from '../components/Error.vue'
import { createDentist } from '../apis/dentists'
import { getClinics } from '../apis/booking'
export default {
  name: 'signup-view',
  components: {
    Error
  },
  
  async mounted(){
       this.allClinics = await getClinics()
       
     },
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        socialNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        admin:false
        
      },
      error: '',
      allClinics:[],
      selectedClinic:null
    }
  },
  methods: {
    async onSignUp() {
      try {
        //   
        // TODO create a field for the theme on the signup form
        const dentist = await createDentist(
          this.form.firstName,
          this.form.lastName,
          this.form.socialNumber,
          this.form.email,
          this.form.password,
          this.form.admin,
          this.selectedClinic._id
        )

        //const allClinics = await getClinics()
        alert('Dentist registered')
        this.$router.push('/account')
      } catch (error) {
        if (error.response.data === 'Forbidden'){
          this.error = 'Only admins can perform this action.'
        } else if(error.response.data === 'Input missing data, All data required'){
          this.error = 'Fill all fields.'
        } else if(error.response.data === 'Dentist already exists'){
          this.error = 'This dentist is already registered.'
        } else if(error.response.data === 'Password is wrong'){
          this.error = 'Password missing.'
        } else if(error.response.status === 500){
          this.error = 'Server error. Please try again later.'
        } else {
          this.error = 'An error occurred.'
        }
        
      }
    }
  }
}
</script>
<style scoped>
button {
  background-color: var(--button);
  color: var(--button-letter);
  border: none;
}



h1 {
  margin: 0;
  padding: 0;
  font-weight: 900;
  font-family: Georgia, 'Times New Roman', Times, serif;
  color:rgb(14, 14, 83);
}  

h2{
 font-size: large;
 margin-bottom: 40px;
}
.background{
  background-color: rgba(74, 100, 161, 0.903);
  padding: 3%;
  min-height: 100vh;
  box-sizing: border-box;
}
.container {
  
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 70vh;
  border-radius:10%;
  border-color: black;
}
.registration-box {
  background-color: white;
  text-align: center;
  margin: center;
  font-style: initial;
  font-weight: 600;
  padding-block: 0;
  padding: 20%;
  border-width: 10px;
  border-style: initial;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .registration-box {
    padding: 5%;
  }
}

</style>
