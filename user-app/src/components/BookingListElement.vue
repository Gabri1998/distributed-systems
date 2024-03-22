<template>
  <b-card :title=booking.clinic.clinicName :subtitle=booking.clinic.address class="card">
    <div class="time">
      {{ booking.date }}
      <br>
      {{booking.time}}
    </div>
  </b-card>
</template>
  
<script>
export default {
  name: 'BookingListElement',
  props: {
    booking: {
      type: Object,
      clinic: Object,
      date: String,
      time: String,
      comments: String,
      required: true
    }
  },
  methods: {
    expand() {
      console.log('Expand '+ this.booking.type)
    }
  }
  // Add methods or lifecycle hooks as needed
}
</script>

<style scoped>

.time {
  text-align: right;
}

.card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  /* Add more styles as needed */
}

.card:hover {
  background-color: rgba(0, 0, 0, 0.1); /* Darken the background color on hover */
  cursor: pointer; /* Change cursor to indicate interactivity */
}
</style>