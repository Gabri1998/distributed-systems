<template>
    <AppointmentSchedular/>
    <div class="auth-wrapper col-md-6 offset-md-3">
      <div class="auth-inner">
        <h3>Reservation</h3>
        <div>
          <b-button variant="primary" size="lg" @click="showDateTimePicker">Regular</b-button>
            <b-modal v-model="dateTimePickerVisible" @ok="saveDateTime" title="Select Date and Time">
              <b-container>
                <b-row>
                  <b-col>
                    <b-form-group label="Select Date">
                      <b-form-select v-model="selectedDate" :options="dateSlots" required></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Select Time">
                      <b-form-select v-model="selectedTime" :options="timeSlots" required></b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-container>
          </b-modal>
          <b-button style="float: right;" variant="primary" size="lg" href="/questionnaire">Emergency</b-button>
        </div>
      </div>
    </div>
  </template>
  
<script>
import AppointmentSchedular from '../components/AppointmentSchedular.vue'

export default {
  name : 'appointment-view',
  components: {
    AppointmentSchedular
  },
  data() {
    return {
      selectedDate: null,
      selectedTime: null,
      dateTimePickerVisible: false,
      timeSlots: generateTimeSlots(),
      dateSlots: generateDateSlots(),
    };
  },
  methods: {
    showDateTimePicker() {
      this.dateTimePickerVisible = true;
    },
    hideDateTimePicker() {
      this.dateTimePickerVisible = false;
    },
    selectTime(timeSlot) {
      this.selectedTime = timeSlot;
      this.hideDateTimePicker();
    },

    // Just used a method I got from using ChatGPT for now. This data will be transmitted to the booking_service component without being saved.
    saveDateTime() {
      const dataToSave = {
        selectedDate: this.selectedDate,
        selectedTime: this.selectedTime,
      };
      const jsonString = JSON.stringify(dataToSave, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'selectedDateTime.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};

function generateTimeSlots() {
  const timeSlots = [];
  const startTime = new Date();
  startTime.setHours(8, 0, 0, 0); // Set to the clinic's opening time

  for (let i = 0; i < 24; i++) { // Change the maximum i value to alter the closing time.
    const time = new Date(startTime.getTime() + i * 30 * 60 * 1000); // Currently have time slots with 30 minutes interval.
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // A method to disable the time slots that are not available (such as reserved or lunch time)
    const isDisabled = time.getHours() === 12 || (time.getHours() === 13 && time.getMinutes() === 0);
    timeSlots.push({ text: formattedTime, value: formattedTime, disabled: isDisabled });
  }

  return timeSlots;
}

function generateDateSlots() {
  const dateSlots = [];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set to the beginning of the day

  for (let i = 0; i < 20; i++) { // Change the maximum i value to alter the number of days ahead
    const date = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000); // Add i days
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    // A method to disable the date slots that are not available (customize as needed)
    const isDisabled = date.getDay() === 0; // You can implement logic to disable specific dates
    dateSlots.push({ text: formattedDate, value: date.toISOString(), disabled: isDisabled });
  }

  return dateSlots;
}

  
</script>


<style scoped>

label {
  color: #3f3f3f;
  font-size: 2.3em;
  font-weight: bold;
  cursor: pointer;
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #ccc;
}
</style>