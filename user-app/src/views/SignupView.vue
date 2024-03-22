<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-6 offset-md-3">
        <div class="auth-wrapper">
          <div class="auth-inner">
            <div>
              <Error v-if="error" :error="error"></Error>
              <h3>Sign Up</h3>
              <p>Welcome to sign up page!</p>
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

              <!--  <b-form-group label="Clinic" label-for="clinicDropdown" label-cols-md="2">
              <b-dropdown id="clinicDropdown" text="Select clinic" block variant="primary" lazy>
                <b-dropdown-item-button v-for="clinic in clinics" :key="allClinics" @click="clinic = clinic">{{ clinic.name }}</b-dropdown-item-button>
              </b-dropdown>
            </b-form-group> -->

              <div class="my-3">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Error from '../components/Error.vue'
import { createUser } from '../apis/users'
export default {
  name: 'signup-view',
  components: {
    Error
  },
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        socialNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      error: ''
    }
  },
  methods: {
    async onSignUp() {
      try {
        await createUser(
          this.form.firstName,
          this.form.lastName,
          this.form.socialNumber,
          this.form.email,
          this.form.password,
          'light'
        )

        this.$router.push('/login')
      } catch (error) {
        this.error = 'En error occurred.'
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
