<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-6 offset-md-3">
        <div class="auth-wrapper">
          <div class="auth-inner">
            <div>
              <h3 class="text-md">Login</h3>
              <p class="text-sm">Welcome to login page!</p>
              <hr />
            </div>

            <div class="alert alert-danger" v-if="!!error">{{ error }}</div>
            <form @submit.prevent="onLogin()">
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
              <div class="my-3">
                <button type="submit" class="btn btn-primary btn-lg">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, getUserInfo } from '../apis/users'
import { connect } from '../ws'
export default {
  name: 'login-view',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      error: ''
    }
  },

  methods: {
    async onLogin() {
      try {
        const token = await login(undefined, this.form.email, this.form.password)
        localStorage.setItem('token', token)

        const userDetails = await getUserInfo()
        connect(userDetails.id)
        this.$store.dispatch('user', userDetails)
        console.log('Loggedin: ' + userDetails)
        this.$router.push('/home')
      } catch (error) {
        if (error.response) {
          console.log('Error status code:', error.response.status)
          if (error.response.status === 401) {
            this.error = 'Invalid email/password.'
          } else if (error.response.status === 500) {
            this.error = 'Server error'
          } else {
            this.error = 'An error occurred during login.'
          }
        } else {
          this.error = 'An unexpected error occurred.'
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
</style>
