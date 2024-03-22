<template>
  <div class="row" id="specialPage">
    <div class="col-md-6 offset-md-3">
      <div class="auth-wrapper">
        <div class="auth-inner">
          <div>
            <Error v-if="error" :error="error"></Error>
            <div v-if="successMessage" class="alert alert-success"> {{ successMessage }} </div>
            <h3>Emergency Reservation</h3>
            <p>Slots created here are dedicated for the patients in immediate need.</p>
            <hr />
          </div>

          <form @submit.prevent="onCreate()">
            <div class="form-group">
              <label>Start time</label>
              <input
                type="datetime-local"
                class="form-control"
                prepend-icon="ni ni-hat-3"
                placeholder="Start date"
                v-model.trim="form.start"
                required
              />
            </div>

            <div class="form-group">
              <label>End time </label>
              <input
                type="datetime-local"
                class="form-control"
                placeholder="End Date"
                v-model.trim="form.end"
                required
              />
            </div>
            <div class="my-3">
              <button type="submit" class="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
      <div class="my-5"></div>
      <div class="reservations">
        <form @submit.prevent="onSelect()">
          <div class="form-group">
            <p>Please select the date to see your Emergency Slots.</p>
            <input
              type="date"
              class="form-control"
              prepend-icon="ni ni-hat-3"
              placeholder="Start date"
              v-model.trim="form.date"
              required
            />
          </div>
          <div class="my-3">
            <button type="submit" class="btn btn-primary">Get Slots</button>
          </div>
          <div v-if="slots.length > 0">
            <div v-for="(slot, index) in slots" :key="index" class="slot-item">
              <b-list-group>
                <b-list-group-item href="#" class="flex-column align-items-start">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{ 'Slot' + (index + 1) }}</h5>
                    <small>{{ form.date }}</small>
                  </div>
                  <p class="mb-1">Start time: {{ slot.start.split('T')[1].slice(0, 5) }}</p>
                  <p class="mb-1">End time: {{ slot.end.split('T')[1].slice(0, 5) }}</p>
                  <div v-if="slot.booked">
                    <small>Booked</small>
                  </div>
                </b-list-group-item>
                <b-list-group-item href="#" class="flex-column align-items-middle">
                  <button @click="onDelete(slot._id)" class="btn btn-primary">Delete Slot</button>
                </b-list-group-item>
              </b-list-group>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Error from '../components/Error.vue'
import { getDentistInfo } from '../apis/dentists'
import {
  createEmergencySlot,
  getEmergencySlots,
  deleteEmergencySlot
} from '../apis/emergencyBooking'
export default {
  name: 'create-slots-view ',
  components: {
    Error
  },

  async mounted() {
    this.dentistDetails = getDentistInfo()
  },
  data() {
    return {
      form: {
        start: '',
        end: '',
        duration: 0
      },
      error: '',
      successMessage: '',
      dentistDetails: null,
      selectedDate: '',
      slots: []
    }
  },
  methods: {
    async onCreate() {

      const startDate = new Date(this.form.start);
      const endDate = new Date(this.form.end);

      if (endDate <= startDate) {
        this.error = 'End time must be after the start time.';
        return;
      }
      try {
        const emergencySot = await createEmergencySlot(
          this.form.start,
          this.form.end,
          this.dentistDetails._id,
          this.dentistDetails.clinic_id
        )

        this.error = ''
        this.successMessage = 'Emergency slot created successfully!';

        this.$router.push('/')
      } catch (error) {
        this.error = 'An error occurred.'
      }
    },

    async onSelect() {
      try {
        this.slots = await getEmergencySlots(this.form.date)
      } catch (err) {
        console.error(err)
      }
    },

    async onDelete(slotId) {
      try {
        await deleteEmergencySlot(slotId)
        this.slots = await getEmergencySlots()
        this.error = ''
        this.successMessage = 'Slot deleted successfully';
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
<style scoped>
button {
  background-color: var(--bs-success);
  color: var(--button-letter);
}

#specialPage {
  height: 200%;
  background-color: rgba(74, 100, 161, 0.903);
}

.reservations {
  display: flex;
  justify-content: center;
  align-items: center;
}

.slots-container {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  margin-top: 20px;
}

.slot-item {
  margin-bottom: 10px;
}
</style>
