import Vuex from 'vuex'
import { getClinics, getDentists } from './apis/clinic'
import { getSlots, book, unBook } from './apis/booking'
import { state } from './vuex'

export const store = new Vuex.Store({
  state,
  getters: {
    user: (state) => state.user,
    clinics: (state) => state.clinics,
    dentists: (state) => state.dentists,
    slots: (state) => state.slots,
    getSelectedClinic: (state) => state.selectedClinic,
    getSelectedDentist: (state) => state.selectedDentist,
    bookedSlots: (state) => state.bookedSlots,
    clinicDentists: (state) => state.clinicDentists,
    dentistSlots: (state) => state.dentistSlots,
    errorMessage: (state) => state.errorMessage
  },
  actions: {
    user({ commit }, user) {
      commit('SET_USER', user)
    },

    async fetchClinics({ commit, dispatch }) {
      try {
        // Make an API request to fetch all clinics information
        const clinics = await getClinics()
        clinics.forEach((clinic) => {
          console.log('Clinic name:' + clinic.clinicName)
        })
        console.log('All clinics' + clinics)
        // Update the clinic state
        commit('SET_CLINICS', clinics)
        dispatch('fetchDentists')
      } catch (error) {
        console.error('Error fetching clinic information:', error)
        let errorMessage = 'An unexpected error occurred.'

        if (error.response) {
          console.log('Error status code:', error.response.status)
          if (error.response.status === 500) {
            errorMessage = 'Server error in getting clinics.'
          } else {
            errorMessage = 'An error occurred during fetching clinics.'
          }
        }
        commit('SET_ERROR', errorMessage)
      }
    },

    async fetchDentists({ commit, dispatch }) {
      try {
        // Make an API request to fetch all clinics information
        const dentists = await getDentists()
        console.log('All dentists' + dentists)
        // Update the dentist state
        commit('SET_DENTISTS', dentists)
        dispatch('fetchSlots')
      } catch (error) {
        console.error('Error fetching dentists information:', error)
        let errorMessage = 'An unexpected error occurred.'

        if (error.response) {
          console.log('Error status code:', error.response.status)
          if (error.response.status === 500) {
            errorMessage = 'Server error in getting dentists.'
          } else {
            errorMessage = 'An error occurred during fetching dentists.'
          }
        }
        commit('SET_ERROR', errorMessage)
      }
    },

    async fetchSlots({ commit }) {
      try {
        // Make an API request to fetch slots
        const slots = await getSlots()

        // Update the slots state
        commit('SET_SLOTS', slots)
      } catch (error) {
        console.error('Error fetching slots information:', error)
        let errorMessage = 'An unexpected error occurred.'

        if (error.response) {
          console.log('Error status code:', error.response.status)
          if (error.response.status === 500) {
            errorMessage = 'Server error in getting slots.'
          } else {
            errorMessage = 'An error occurred during fetching slots.'
          }
        }
        commit('SET_ERROR', errorMessage)
      }
    },

    selectClinic({ commit, dispatch }, clinic) {
      console.log('selected clinic ' + clinic.clinicName)
      commit('SET_SELECTED_CLINIC', clinic)
      dispatch('clinicDentists')
    },

    clinicDentists({ commit, state }) {
      if (!state.selectedClinic) {
        // Handle the error, maybe by returning early or setting a default value
        return
      }

      const clinicDentists = state.dentists.filter(
        (dentist) => dentist.clinic_id === state.selectedClinic._id
      )
      commit('SET_CLINIC_DENTISTS', clinicDentists)
    },

    selectDentist({ commit, dispatch }, dentist) {
      commit('SET_SELECTED_DENTIST', dentist)
      dispatch('dentistSlots')
    },

    dentistSlots({ commit, dispatch }) {
      const dentistSlots = []
      state.slots.forEach((slot) => {
        if (slot.dentist_id === state.selectedDentist._id) {
          dentistSlots.push(slot)
        }
      })
      commit('SET_DENTIST_SLOTS', dentistSlots)
      dispatch('bookedSlots')
    },

    bookedSlots({ commit }) {
      const booked = []
      // get bookedSlots
      state.dentistSlots.forEach((slot) => {
        if (slot.booked) {
          booked.push(slot)
        }
      })
      commit('SET_BOOKED_SLOTS', booked)
    },

    updateBookedSlots({ dispatch }) {
      dispatch('fetchSlots')
      dispatch('dentistSlots')
    },

    async bookSlot({ commit, dispatch }, { userId, slot_id }) {
      try {
        // Make an API request to book a slot
        await book(slot_id, userId)
        console.log(`Slot booked: by User ID ${userId}`)
        dispatch('updateBookedSlots')
      } catch (error) {
        console.error('Error booking slot', error)
        let errorMessage = 'An unexpected error occurred.'

        if (error.response) {
          console.log('Error status code:', error.response.status)
          if (error.response.status === 500) {
            errorMessage = 'Server error in booking slot.'
          } else {
            errorMessage = 'An error occurred during booking slot.'
          }
        }
        commit('SET_ERROR', errorMessage)
      }
    },

    async unBookSlot({ commit, dispatch }, { userId, slot_id }) {
      try {
        // Make an API request to unbook a slot
        await unBook(slot_id)
        console.log(`Slot unbooked: by User ID ${userId}`)
        dispatch('updateBookedSlots')
      } catch (error) {
        console.error('Error unbooking slot', error)
        let errorMessage = 'An unexpected error occurred.'

        if (error.response) {
          console.log('Error status code:', error.response.status)
          if (error.response.status === 500) {
            errorMessage = 'Server error in unbooking slot.'
          } else {
            errorMessage = 'An error occurred during unbooking slot.'
          }
        }
        commit('SET_ERROR', errorMessage)
      }
    },

    errorMessage({ commit }, errorMessage) {
      commit('SET_ERROR', errorMessage)
    }
  },
  mutations: {
    user(state, user) {
      state.user = user
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_CLINICS(state, clinics) {
      state.clinics = clinics
    },
    SET_DENTISTS(state, dentists) {
      state.dentists = dentists
    },
    SET_SLOTS(state, slots) {
      state.slots = slots
    },
    SET_SELECTED_CLINIC(state, clinic) {
      state.selectedClinic = clinic
    },
    SET_SELECTED_DENTIST(state, dentist) {
      state.selectedDentist = dentist
    },
    SET_CLINIC_DENTISTS(state, clinicDentists) {
      state.clinicDentists = clinicDentists
    },
    SET_DENTIST_SLOTS(state, dentistSlots) {
      state.dentistSlots = dentistSlots
    },
    SET_BOOKED_SLOTS(state, booked) {
      state.bookedSlots = booked
    },
    SET_ERROR(state, errorMessage) {
      state.errorMessage = errorMessage
    }
  }
})
