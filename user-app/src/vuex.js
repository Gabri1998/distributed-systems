import Vuex from 'vuex'
import { getClinics, getClinicDentists, getDentists } from './apis/clinic'
import { getDentistSlots, book, unBook } from './apis/booking'
import { getNotifications } from './apis/notification'

const state = {
  user: null,
  clinics: [],
  dentists: [],
  selectedClinic: null,
  selectedDentist: null,
  slots: [],
  bookedSlots: [],
  clinicDentists: [],
  dentistSlots: [],
  errorMessage: null,
  notifications: [],
  showNotifications: false
}

const store = new Vuex.Store({
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
    errorMessage: (state) => state.errorMessage,
    notifications: (state) => state.notifications,
    showNotifications: (state) => state.showNotifications
  },
  actions: {
    user({ commit, dispatch }, user) {
      commit('SET_USER', user)
      dispatch('getNotifications')
    },

    async fetchClinics({ commit }) {
      try {
        // Make an API request to fetch all clinics information
        const clinics = await getClinics()
        // Update the clinic state
        commit('SET_CLINICS', clinics)
        //dispatch('fetchDentists')
      } catch (error) {
        let errorMessage = 'An unexpected error occurred.'
        if (error.response) {
          if (error.response.status === 500) {
            errorMessage = 'Server error in getting clinics. Please try again later.'
          } else {
            errorMessage = 'An error occurred during fetching clinics. Please try again.'
          }
        }
        commit('SET_ERROR', errorMessage)
        console.log('Error message committed to store:', errorMessage)
      }
    },

    async fetchDentists({ commit }) {
      try {
        if (!state.selectedClinic) {
          console.log('selected clinic not set yet. ')
          return
        }
        // Make an API request to fetch all dentists
        const dentists = await getDentists(state.selectedClinic.id)

        dentists.forEach((dentist) => {
          console.log('fetching all clinic dentist: ' + dentist.email)
        })
        // Update the dentist state
        commit('SET_DENTISTS', dentists)
        //dispatch('fetchSlots')
      } catch (error) {
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

    async fetchClinicDentists({ commit }) {
      try {
        if (!state.selectedClinic) {
          console.log('selected clinic not set yet. ')
          return
        }
        // Make an API request to fetch all dentists
        const clinicDentists = await getClinicDentists(state.selectedClinic.id)

        clinicDentists.forEach((dentist) => {
          console.log('clinic dentist: ' + dentist.email)
        })
        // Update the dentist state
        commit('SET_CLINIC_DENTISTS', clinicDentists)
        //dispatch('fetchSlots')
      } catch (error) {
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

    async fetchDentistSlots({ commit, dispatch }) {
      try {
        if (!state.selectedDentist) {
          console.log('selected dentist not set yet. ')
          return
        }
        // Make an API request to fetch slots
        console.log('selected dentist id ' + state.selectedDentist._id)
        const dentistSlots = await getDentistSlots(state.selectedDentist._id)
        // Update the slots state
        commit('SET_DENTIST_SLOTS', dentistSlots)
        dispatch('bookedSlots')
      } catch (error) {
        let errorMessage = 'An unexpected error occurred.'
        if (error.response) {
          if (error.response.status === 500) {
            errorMessage = 'Server error in getting slots.'
          } else {
            errorMessage = 'An error occurred during fetching slots.'
          }
        }
        commit('SET_ERROR', errorMessage)
      }
    },

    async selectClinic({ commit }, clinic) {
      console.log('selected clinic ' + clinic.clinicName)
      console.log('selected clinic id ' + clinic.id)
      commit('SET_SELECTED_CLINIC', clinic)
      //await dispatch('fetchClinicDentists')
    },

    clinicDentists({ commit, state }) {
      if (!state.selectedClinic) {
        console.log('selected clinic not set yet. ')
        return
      }

      const clinicDentists = state.dentists.filter(
        (dentist) => dentist.clinic_id === state.selectedClinic.id
      )
      commit('SET_CLINIC_DENTISTS', clinicDentists)
    },

    async selectDentist({ commit, state }, dentistId) {
      const selectedDentist = state.clinicDentists.find((d) => d._id === dentistId)
      if (selectedDentist) {
        commit('SET_SELECTED_DENTIST', selectedDentist)
        //await dispatch('fetchDentistSlots')
      } else {
        console.error('Dentist not found with id:', dentistId)
      }
    },

    dentistSlots({ commit, dispatch, state }) {
      const dentistSlots = state.slots.filter(
        (slot) => slot.dentist_id === state.selectedDentist._id
      )
      commit('SET_DENTIST_SLOTS', dentistSlots)
      dispatch('bookedSlots')
    },

    bookedSlots({ commit, state }) {
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
      dispatch('fetchDentistSlots')
    },

    async bookSlot({ commit, dispatch }, { slotId, userId }) {
      try {
        await book(slotId, userId)
        console.log(`Slot booked: by User ID ${userId}`)
        dispatch('updateBookedSlots')
      } catch (error) {
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

    async unBookSlot({ commit, dispatch, state }, slot_id) {
      try {
        // Make an API request to unbook a slot
        await unBook(slot_id)
        console.log(`Slot unbooked: by User ID: ` + state.user.id)
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

    async fetchNotifications({ commit }) {
      try {
        // Fetch notifications from your API or another source
        const notifications = await getNotifications()
        commit('setNotifications', notifications)
      } catch (error) {
        console.error('Error fetching notifications:', error)
        // Handle error
      }
    },

    markNotificationsAsRead({ commit }) {
      // Assuming you have an API call or logic to mark notifications as read
      // Adjust as needed
      commit('setNewNotifications', false)
    },

    errorMessage({ commit }, errorMessage) {
      commit('SET_ERROR', errorMessage)
    },

    async getNotifications({ commit }) {
      try {
        // Make an API request to fetch notifications
        const notifications = await getNotifications()
        notifications.forEach((notification) => {
          console.log('checking notifications' + notification.note)
        })
        // Update the notifications state
        commit('SET_NOTIFICATIONS', notifications)
      } catch (error) {
        let errorMessage = 'An unexpected error occurred.'
        if (error.response) {
          if (error.response.status === 500) {
            errorMessage = 'Server error in getting notifications.'
          } else {
            errorMessage = 'An error occurred during fetching notifications.'
          }
        }
        commit('SET_ERROR', errorMessage)
      }
    },

    addNotification({ commit }, notification) {
      commit('ADD_NOTIFICATION', notification)
    },
    removeNotification({ commit }, notificationId) {
      commit('REMOVE_NOTIFICATION', notificationId)
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
      console.log('Setting error message:', errorMessage)
      state.errorMessage = errorMessage
    },
    SET_NOTIFICATIONS(state, notifications) {
      state.notifications = notifications
    },
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push(notification)
    },
    REMOVE_NOTIFICATION(state, notificationId) {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== notificationId
      )
    },
    TOGGLE_SHOW_NOTIFICATIONS(state) {
      state.showNotifications = !state.showNotifications
    }
  }
})

export default store
