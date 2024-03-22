<template>
    <div class="background">
      <div class="container">
  
        <div class="registration-box">
          <Error v-if="this.error!==''" :error="this.error"></Error>
  
          <h1>Register Clinic</h1>
          <h2>Enter the clinic details below for registration.</h2>
  
          <b-form @submit.prevent="onRegister()">
            <b-form-group label="Clinic Name" label-for="clinicName" label-cols-md="2">
              <b-form-input id="clinicName" v-model="form.clinicName" type="text" placeholder="Enter Clinic" trim required></b-form-input>
            </b-form-group>
  
            <b-form-group label="Address" label-for="Address" label-cols-md="2">
              <b-form-input id="address" v-model="form.address" type="address" placeholder="Enter address" trim required></b-form-input>
            </b-form-group>
  
            <b-button  type="submit" variant="primary">Register</b-button>
          </b-form>
  
        </div>
  
      </div>
    </div>
  </template>
  
  <script>
  import Error from '../components/Error.vue'
  import {createClinic}  from '../apis/booking'
  export default {
    components: {
      Error
    },
    mounted() {
      document.body.style.backgroundColor = '#989898'
      
    },
    data() {
      return {
        form:{
        clinicName: '',
        address: '',
    },
    error: ''
      }
      
    },
    computed:{
      notValidInput(){
        return !(this.clinicName && this.Address)
      }
    },
    methods: {
      
       validateAddress(){
        if (this.Address.trim() === '') {
      // Empty address
       alert('Please enter a proper address.');
       return false;
       } else {
       // Valid address
       return true;
       }
      }, 
      async onRegister() {
        
          try {
            const clinic = await createClinic(
          this.form.clinicName,
          this.form.address,
          )      
            
          console.log('Registration successful');
          alert('Registered');
          this.$router.push('/account')
      } catch (error) {
        console.error('An error occurred during registration:', error);
        if (error.response.data === 'Input missing data, All input fields are required to be filled.'){
          this.error='All input fields are required to be filled.'
        } else if (error.response.data === 'Clinic already exists'){
          this.error = 'This clinic already exists.'
        } else if (error.response.data === 'Forbidden. Only admins can perform this action.'){
          this.error = 'This action needs admin privilege.'
        } else if(error.response.status === 500){
          this.error = 'Server error. Please try again later.'
        } else {
        this.error='Registration unsuccessful. Please try again later.'
        }
      }
        }       
      }, 
    }
  
  </script>
  
  
  <style>
  
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
  