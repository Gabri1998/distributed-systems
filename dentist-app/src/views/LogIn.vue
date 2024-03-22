<script>
import { login, getDentistInfo } from '../apis/dentists'
import Error from '../components/Error.vue'
export default {
  name: 'login-view',
  components: {
    Error
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      error: '',
    }
  },
  mounted() {
    this.form.email = ""
    this.form.password = ""
  },
  methods: {
    async onLogin() {
      try {
        const token = await login(undefined, this.form.email, this.form.password)
        localStorage.setItem('token', token)

        const dentistDetails = await getDentistInfo()
        this.$store.dispatch('dentist', dentistDetails)
      if(dentistDetails.admin){
        this.$router.push('/account')
      }else{
        this.$router.push('/home')
      }
        
      } catch (error) {
        if (error.response.status === 404) {
          this.error = 'Invalid email/password. Please try again.'
        } else if (error.response.status === 403) {
          this.error = 'Not authorized to view this resource. Contact your admin.'
        } else if (error.response.status === 500) {
          this.error = 'Server error. Check your MQTT broker is running.'
        } else if (error.response.status === 400) {
          this.error = 'Incorrect input.'
        } else if (error.response.status === 429) {
          this.error = 'Too frequent requests. Try again later.'
        } else if (error.response.status === 502) {
          this.error = 'Server error.'
        } else if (error.response.status === 503) {
          this.error = 'Server unavailable. Try again later.'
        } else {
          this.error = 'Unable to log in currently. Please try again later.'
        }
      }
    }

  }
}
</script>

<template>
  <div>

    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <div class="background">
      <div class="container">

        <div class="login-box">
          <Error :error=this.error v-if="this.error !== ''"></Error>

          <h1>Log In</h1>
          <h2>Log in to get started with your work!</h2>

          <b-form @submit="onLogin">
            <b-form-group label="Email " label-for="email" label-cols-md="1">
              <b-form-input id="email" v-model="form.email" type="email" required></b-form-input>
            </b-form-group>

            <b-form-group label="Password" label-for="password" label-cols-md="2">
              <b-form-input id="password" v-model="form.password" type="password" required></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary">LOGIN</b-button>
          </b-form>

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin: 0;
  padding: 0;
  font-weight: 900;
  font-family: Georgia, 'Times New Roman', Times, serif;
  color: rgb(14, 14, 83);
}

h2 {
  font-size: large;
  margin-bottom: 40px;
}

.background {
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
  border-radius: 10%;
  border-color: black;
}

.login-box {
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

.create-account-prompt {
  font-size: small;
  margin-top: 20px;
}

.hyperlink {
  color: rgb(51, 12, 226);
}

@media (max-width: 768px) {
  .login-box {
    padding: 5%;
  }
}
</style>