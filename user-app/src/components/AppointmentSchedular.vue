<!-- eslint-disable no-undef -->
<template>
  <div>
    <h6>Choose a dentist to see schedule.</h6>
    <select v-model="selectedDentist" @change="onDentistChange">
      <option v-for="dentist in dentists" :key="dentist._id" :value="dentist._id">
        {{ dentist.firstName + ' ' + dentist.lastName }}
      </option>
    </select>
    <br />
    <div class="appointment-scheduler-container">
      <Datepicker
        v-model="selectedDate"
        @input="onDateChange"
        placeholder="Choose date"
        :key="selectedDate"
        :datesDisabled="disabledDate"
      />
      <br />
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Time</th>
            <th v-for="date in dates" :key="date">{{ formatDateHeading(date) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="timeSlot in timeSlots" :key="timeSlot.time">
            <td>{{ timeSlot.time }}</td>
            <td
              v-for="date in dates"
              :key="date"
              @click="showEvent(date, timeSlot.time)"
              @mouseenter="highlightCell(date, timeSlot.time, true)"
              @mouseleave="highlightCell(date, timeSlot.time, false)"
              :style="{ backgroundColor: getBackgroundColor(date, timeSlot.time) }"
              style="position: relative"
              :slots="slots"
            >
              <div
                v-if="
                  isSlotBooked(date, timeSlot.time) && isBookedByCurrentUser(date, timeSlot.time)
                "
                @click="unbookSlot(date, timeSlot.time, $event)"
                class="unbook-cell"
              >
                <span class="unbook-icon">unbook</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Datepicker from 'vue3-datepicker'
import moment from 'moment'
import { getSlot } from '../apis/booking'

export default {
  components: {
    Datepicker
  },
  watch: {
    bookedSlots: 'generateDateRange'
  },
  setup() {
    const store = useStore()
    const dentists = ref([])

    onMounted(() => {
      dentists.value = store.getters.clinicDentists
    })

    const selectedDate = ref(new Date())
    const timeSlots = ref([
      { time: '08:00' },
      { time: '09:00' },
      { time: '10:00' },
      { time: '11:00' },
      { time: '12:00' },
      { time: '13:00' },
      { time: '14:00' },
      { time: '15:00' },
      { time: '16:00' },
      { time: '17:00' }
    ])

    const bookedSlots = ref([])
    const slots = ref([])

    const generateDateRange = () => {
      const startDate = moment(selectedDate.value).startOf('week')
      const endDate = moment(selectedDate.value).endOf('week')
      const dateRange = []

      while (startDate.isSameOrBefore(endDate, 'day')) {
        if (startDate.day() !== 6 && startDate.day() !== 0) {
          dateRange.push(startDate.format('YYYY-MM-DD'))
        }
        startDate.add(1, 'day')
      }

      return dateRange
    }

    const dates = computed(() => generateDateRange(selectedDate.value))
    const selectedDentist = ref(null)

    const onDentistChange = async () => {
      if (selectedDentist.value) {
        await store.dispatch('selectDentist', selectedDentist.value)
        await store.dispatch('fetchDentistSlots')

        slots.value = store.getters.dentistSlots || []
        bookedSlots.value = store.getters.bookedSlots || []
        generateDateRange(selectedDate.value)
      }
    }

    const highlightedCell = ref({
      date: null,
      time: null
    })

    const onDateChange = (newDate) => {
      // update the displayed slots
      console.log('date : ' + newDate)
      selectedDate.value = newDate
      console.log('date : ' + selectedDate.value)

      dates.value = generateDateRange(selectedDate.value)
    }

    return {
      selectedDate,
      timeSlots,
      slots,
      bookedSlots,
      dates,
      onDateChange,
      highlightedCell,
      selectedDentist,
      dentists,
      onDentistChange
    }
  },

  methods: {
    formatDateHeading(date) {
      // eslint-disable-next-line no-undef
      return moment(date).format('MMM D, YYYY')
    },

    validateDate(newDate) {
      const currentDate = new Date()
      console.log('date : ' + newDate)
      return newDate < currentDate
    },

    async showEvent(date, time) {
      try {
        const user = this.$store.getters.user
        if (user) {
          const userId = user.id
          console.log(this.validateDate(date))
          if (this.validateDate(date)) {
            alert('Please choose a date in the future.')
            return
          }
          if (this.selectedDentist) {
            const slotId = this.getSlotID(date, time)
            if (slotId) {
              const checkSlotAvailable = await getSlot(slotId)
              const isSlotBooked = this.isSlotBooked(date, time)
              if (!isSlotBooked && !checkSlotAvailable.booked) {
                var userConfirmed = confirm('Do you want to book this slot?')
                if (userConfirmed) {
                  try {
                    this.$store.dispatch('bookSlot', { slotId, userId })
                    alert('Slot booked!')
                    this.slots.value = this.$store.getters.dentistSlots || []
                    this.bookedSlots.value = this.$store.getters.bookedSlots || []
                    this.$store.dispatch('fetchNotifgetNotificationsications')
                    this.highlightedCell = { date, time }
                  } catch (error) {
                    console.error('Error booking slot', error)
                    alert('An error occurred while booking the slot.')
                  }
                } else {
                  alert('Slot not booked.')
                }
              } else {
                alert(`Slot at ${date}, ${time} is already booked.`)
              }
            } else {
              alert(`Slot at ${date}, ${time} is currently unavailable.`)
            }
          } else {
            alert('Please select a dentist.')
          }
        } else {
          alert('User data not available. Please log in.')
        }
      } catch (error) {
        console.error('Error fetching solt information', error)
        let errorMessage = 'An unexpected error occurred.'

        if (error.response) {
          console.log('Error status code:', error.response.status)
          if (error.response.status === 500) {
            errorMessage = 'Server error in getting solt information.'
          } else {
            errorMessage = 'An error occurred during fetching solt information.'
          }
        }
        this.$store.dispatch('errorMessage', errorMessage)
      }
    },

    bookSlot(date, time) {
      const user = this.$store.getters.user
      if (user) {
        const slot_id = this.getSlotID(date, time)
        if (slot_id) {
          this.$store.dispatch('bookSlot', { slot_id, userId: user._id })
        }
      }
    },

    async unbookSlot(date, time, event) {
      event.stopPropagation()
      const slotId = this.getSlotID(date, time)
      if (slotId) {
        const userConfirmed = confirm('Do you want to unbook this slot?')
        if (userConfirmed) {
          try {
            await this.$store.dispatch('unBookSlot', slotId)
            if (this.$store.errorMessage) {
              console.log('checking error message in ubooking method')
              alert('An error occurred while unbooking the slot.')
            } else {
              alert('Slot is now unbooked!')
              this.slots.value = this.$store.getters.dentistSlots || []
              this.bookedSlots.value = this.$store.getters.bookedSlots || []
              this.$store.dispatch('getNotifications') || []
            }
          } catch (error) {
            console.error('Error unbooking slot', error)
            alert('An error occurred while unbooking the slot.')
          }
        } else {
          alert('Slot not unbooked.')
        }
      } else {
        alert(`Slot at ${date}, ${time} is currently unavailable.`)
      }
    },

    getSlotID(date, time) {
      const combineDateTime = new Date(`${date}T${time}`)
      console.log('Number of slots:', this.slots.length)
      // Iterate through slots and find the one with the same date and time
      const slot = this.slots.find((s) => {
        const slotDateTime = new Date(s.start)
        return (
          slotDateTime.getFullYear() === combineDateTime.getFullYear() &&
          slotDateTime.getMonth() === combineDateTime.getMonth() &&
          slotDateTime.getDate() === combineDateTime.getDate() &&
          slotDateTime.getHours() === combineDateTime.getHours() &&
          slotDateTime.getMinutes() === combineDateTime.getMinutes()
        )
      })
      return slot ? slot._id : null
    },
    highlightCell(date, time, isHovered) {
      this.highlightedCell = isHovered ? { date, time } : { date: null, time: null }
    },
    getBackgroundColor(date, time) {
      return this.isSlotBooked(date, time) ? '#5a5a5a' : '#5a743e'
    },

    isSlotBooked(date, time) {
      const combineDateTime = new Date(`${date}T${time}`)
      return this.bookedSlots.some((slot) => {
        const bookedDateTime = new Date(slot.start)
        return (
          bookedDateTime.getFullYear() === combineDateTime.getFullYear() &&
          bookedDateTime.getMonth() === combineDateTime.getMonth() &&
          bookedDateTime.getDate() === combineDateTime.getDate() &&
          bookedDateTime.getHours() === combineDateTime.getHours() &&
          bookedDateTime.getMinutes() === combineDateTime.getMinutes()
        )
      })
    },

    isBookedByCurrentUser(date, time) {
      const combineDateTime = new Date(`${date}T${time}`)
      const user = this.$store.getters.user
      return this.bookedSlots.some((slot) => {
        const bookedDateTime = new Date(slot.start)
        return bookedDateTime.getTime() === combineDateTime.getTime() && slot.patient_id === user.id
      })
    }
  }
}
</script>

<style scoped>
.schedule-table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table th,
.schedule-table td {
  border: 2px solid #ccc;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.schedule-table td:hover {
  background-color: #f2f2f2;
}
.appointment-scheduler-container {
  max-width: 800px;
  margin: 60px auto;
  padding: 40px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.unbook-cell {
  position: relative;
  cursor: pointer;
}

.unbook-icon {
  top: 0;
  right: 0;
  font-size: 16px;
  color: #ffffff;
  margin: 5px;
}

@media only screen and (max-width: 600px) {
  .appointment-scheduler-container {
    max-width: 100%;
    padding: 20px;
  }
  .schedule-table th,
  .schedule-table td,
  .unbook-icon {
    font-size: 8px;
  }
}
</style>
