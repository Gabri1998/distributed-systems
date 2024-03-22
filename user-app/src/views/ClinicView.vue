<template>
  <div>
    <h1 v-if="clinic">Welcome to {{ clinic.clinicName }}</h1>
    <p></p>
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <AppointmentSchedular />
  </div>
</template>

<script>
import { ref, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import AppointmentSchedular from '../components/AppointmentSchedular.vue'

export default {
  name: 'clinic-view',
  components: {
    AppointmentSchedular
  },
  setup() {
    const store = useStore()
    const clinic = ref(null)

    onBeforeMount(async () => {
      store.dispatch('fetchClinicDentists')
      clinic.value = store.getters.getSelectedClinic
    })

    const error = computed(() => {
      return store.state.errorMessage
    })

    onBeforeUnmount(() => {
      error.value = null
    })

    return {
      clinic,
      error
    }
  }
}
</script>
