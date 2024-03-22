<template>
  <div class="results">
    <!--<button @click="getResults()" class="btn btn-primary">Get Results</button>-->
    <div v-if="loading" class="spinner"></div>
    <div v-if="showResults">
      <div v-if="slot && Object.keys(slot).length > 0" class="slot-item">
        <b-list-group>
          <b-list-group-item href="#" class="flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">Reservation Information</h5>
              <small>{{ slot.date }}</small>
            </div>
            <p class="mb-1">Start time: {{ slot.start.split('T')[1].slice(0, 5) }}</p>
            <p class="mb-1">End time: {{ slot.end.split('T')[1].slice(0, 5) }}</p>
          </b-list-group-item>
          <b-list-group-item href="#" class="flex-column align-items-middle">
            <small>{{ 'Clinic Name: ' + slot.clinicName }}</small>
          </b-list-group-item>
          <b-list-group-item href="#" class="flex-column align-items-middle">
            <small>{{ 'Address: ' + slot.address }}</small>
          </b-list-group-item>
        </b-list-group>
      </div>
      <div v-else>
        <img src="../assets/HealthyTooth.jpg" />
      </div>
    </div>
  </div>
</template>

<script>
import { getResults } from '../apis/emergencyBooking'

export default {
  data() {
    return {
      loading: false,
      showResults: false,
      slot: {}
    }
  },
  methods: {
    async getResults() {
      let resultsReceived = false

      const timeoutId = setTimeout(() => {
        if (!resultsReceived) {
          this.showResults = true
        }
      }, 3000)

      try {
        this.loading = true
        this.slot = await getResults()
        resultsReceived = true
        this.showResults = true
        this.loading = false
        console.log(this.slot)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
        clearTimeout(timeoutId)
      }
    }
  },
  mounted() {
    this.getResults()
  }
}
</script>

<style scoped>
.results {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

.slot-item {
  width: 20em;
  height: 6em;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
