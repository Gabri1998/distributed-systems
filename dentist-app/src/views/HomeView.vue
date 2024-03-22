<template>
  <div id="app">
  <div class="calendar-container">
    <Calendar />
  </div>
  </div>
</template>

<script>
import Calendar from '../components/EventCalendar.vue'
import {  useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { getSlots } from '../apis/booking'
import { getDentistInfo } from '../apis/dentists'
export default {
  components: {
    Calendar
  },
  async mounted(){
   const allSlots=getSlots()
  }
 
}
</script>

<style>
#app {
  background-color: rgba(74, 100, 161, 0.903);
  height:100vh;
}
.calendar-container {
  background-color: #f8f8f8; /* Light gray background */
  padding: 20px;
  border: 1px solid #060505; /* Add a light border */
  border-radius: 6px; /* Add border-radius for a rounded appearance */
  margin-top:50px; /* Adjust the margin-top as needed */
  margin-left: 20px;
  margin-right: 20px;
}
</style>