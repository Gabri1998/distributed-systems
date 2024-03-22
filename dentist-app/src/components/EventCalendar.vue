<template>
  <div>
    
    <div>
      <!--:key" is here to force the calendar to update to show changes without page reload since no connection to backend-->
    <Qalendar 
      :key="calendarKey"
      :events="events" 
      :config="config" 
      @delete-event="deleteEvent" 
      @edit-event="storeEvent"
      >
      <template #eventDialog="props">
       
        <div v-if="props.eventDialogData && props.eventDialogData.title " :style="{marginBottom: '8px', padding: '8px'}">
        <div >
          <p>Slots Date and Time: {{ props.eventDialogData.time.start }}</p></div>
        <b-form v-if="!props.eventDialogData.booked" @submit.prevent="">
         <input  
         class="flyout-input" 
         type="email" id="email" 
         v-model="email"  
         placeholder="Enter Patient email" 
         trim 
         required 
         :style="{ width: '90%', padding: '8px', marginBottom: '8px' }" 
         > 
         
         <button
         v-if="!props.eventDialogData.booked"
         class="close-flyout" 
         type="submit" 
         variant="primary" 
         @click="bookEvent(props)"
         >
        Book!
        </button>

        </b-form>
        
        <button
        v-if="props.eventDialogData.booked"
        class="close-flyout" 
        @click="unBookEvent(props)"
        >
        UnBook!
        </button>

        <button
         
        class="close-flyout" 
        @click="deleteEvent(props.eventDialogData.id)"
        >
        Delete!
        </button>
       
      </div>
    
</template>
  </Qalendar>

    </div>
    
    <b-modal v-model="showModal" id="modal-1" title="Edit event" @ok="editEvent" @hide="resetModal">
      <p>Change the setting you wish to alter</p>
      <b-row>
        <b-col>
          <b-dropdown id="generalType" text="General type of appointment" block variant="outline-primary" lazy>
            <b-dropdown-item-button @click="changeEventType('Cleaning')">Cleaning</b-dropdown-item-button>
            <b-dropdown-item-button @click="changeEventType('Checkup')">Checkup</b-dropdown-item-button>
            <b-dropdown-item-button @click="changeEventType('Emergency appointment')">Emergency appointment
            </b-dropdown-item-button>
            <b-dropdown-item-button @click="changeEventType('Root canal')">Root canal</b-dropdown-item-button>
            <b-dropdown-item-button @click="changeEventType('Other')">Other</b-dropdown-item-button>
          </b-dropdown>
        </b-col>
        <b-col>
          <b-dropdown id="colorSelect" text="Color" block variant="outline-primary" lazy>
            <b-dropdown-item-button @click="changeColorScheme('lightBlue')">Light Blue </b-dropdown-item-button>
            <b-dropdown-item-button @click="changeColorScheme('darkBlue')">Dark Blue</b-dropdown-item-button>
            <b-dropdown-item-button @click="changeColorScheme('lightGreen')">Light Green</b-dropdown-item-button>
            <b-dropdown-item-button @click="changeColorScheme('darkGreen')">Dark Green</b-dropdown-item-button>
            <b-dropdown-item-button @click="changeColorScheme('yellow')">Yellow</b-dropdown-item-button>
            <b-dropdown-item-button @click="changeColorScheme('pink')">Pink</b-dropdown-item-button>
            <b-dropdown-item-button @click="changeColorScheme('burgundy')">Burgundy</b-dropdown-item-button>
            <b-dropdown-item-button @click="changeColorScheme('red')">Red</b-dropdown-item-button>
            <b-dropdown-item-button @click="changeColorScheme('purple')">Purple</b-dropdown-item-button>
            <b-dropdown-item-button @click="changeColorScheme('black')">Black</b-dropdown-item-button>
          </b-dropdown>
        </b-col>
      </b-row>
      <b-row>
        <b-col style="margin-top: 2%; margin-bottom: 2%">
          <label for="eventDescription">Description</label>
          <b-form-input placeholder="Description" id="eventDescription" v-model="this.newEvent.description"
            type="text"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label for="startDate">Start date and time</label>
          <VueDatePicker id="startDate" v-model="this.newEventTime.startTime" class="mb-2"></VueDatePicker>
        </b-col>
        <b-col>
          <label for="endDate">End date and time</label>
          <VueDatePicker class="datepicker" id="endDate" v-model="this.newEventTime.endTime"></VueDatePicker>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import { Qalendar } from "qalendar"
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { getSlots,deleteSlot, book, unBook } from '../apis/booking'
import { getUsers,getUser } from '../apis/users'
import {format} from 'date-fns'

export default {
  async  mounted() {
     document.body.style.backgroundColor = '#989898',
      this.populateEvents()  
  },
  components: {
    Qalendar,
    VueDatePicker
  },
  data() {
    return {
      email: '',
      
      config: {
        week: {
          startsOn: 'monday',
          nDays: 5,
        },
        month: {
          showTrailingAndLeadingDates: false,
        },
        locale: 'en-UK',
        eventDialog:{isCustom:true},
        style: {
          fontFamily: 'Arial',
          colorSchemes: {
            lightBlue: {
              color: "#fff",
              backgroundColor: "#66fdff",
            },
            darkBlue: {
              color: "#fff",
              backgroundColor: "#0500ba",
            },
            lightGreen: {
              color: "#fff",
              backgroundColor: "#1fe800",
            },
            darkGreen: {
              color: "#fff",
              backgroundColor: "#0e6700",
            },
            yellow: {
              color: "#fff",
              backgroundColor: "#ffd966",
            },
            pink: {
              color: "#fff",
              backgroundColor: "#c90076",
            },
            burgundy: {
              color: "#fff",
              backgroundColor: "#800020",
            },
            red: {
              color: "#fff",
              backgroundColor: "#FF0000",
            },
            purple: {
              color: "#fff",
              backgroundColor: "#800080",
            },
            black: {
              color: "#fff",
              backgroundColor: "#000000"
            }
          }
        },
        defaultMode: 'week',
        isSilent: true,
        showCurrentTime: true,
        dayBoundaries: {
          start: 0,
          end: 23,
        },
        // remove to enable month view
        disableModes: ["month"],
      },
      events: [],
      showModal: false,
      newEvent: {
        title: " ",
        with: " ",
        time: { start: " ", end: " " },
        colorScheme: " ",
        isEditable: true,
        id: " ",
        description: " "
      },
      calendarKey: 0,
      newEventTime: {
        startTime: null,
        endTime: null
      }
    }
  },
  methods: {
    updateEditedEvent(updatedEvent) {

      const index = this.events.findIndex(event => event.id === updatedEvent.id)
      if (index !== -1) {
        this.events.splice(index, 1, updatedEvent)
        this.calendarKey += 1
      }

      // TODO: send updated events back to DB
    },
    async populateEvents() {

      const allSlots= await getSlots()
   
   const events= allSlots.map( async event=>{
     const startDate = new Date(event.start)
     const endDate = new Date(event.end)
     let userData=undefined;
     if(event.patient_id){
         userData= await getUser(event.patient_id);
     }
     

     return {  
      title:event.booked?userData.firstName:"available",
       with: " ",
       time: { 
        start: `${format(startDate, 'yyyy-MM-dd HH:mm')}`, 
        end: `${format(endDate, 'yyyy-MM-dd HH:mm')}`, 
      },
       colorScheme: event.booked?"darkBlue":"darkGreen",
       isEditable: true,
       id: event._id,
       booked:event.booked?true:false
       
      }
   })
   
   this.events= await Promise.all(events) ;
   
    },

    async bookEvent(props) {
      const eventId=props.eventDialogData.id
      try {
        if (!this.validateEmail(this.email)) {
          alert('Please enter a valid email address.');
          return;
        }
        if (!this.email) {
          alert("Please enter the patient's email before booking.");
          return;
        }
       
        const users = await getUsers(this.email)
        
        if(users.length==0){
          alert("user not found")

          return
        }
        const user=users[0];
       
        await book(eventId, user._id);
        
        props.closeEventDialog(eventId)
        /* this.$emit('close-event-dialog'); */
      } catch (error) {
        console.error('Error booking event:', error);
        if (error.response) {
          if (error.response.status === 500) {
            alert('Server error in booking. Please try again later.');
          } else if (error.response.status === 400) {
            alert('Invalid patients creadentials.');
          }
        }else {
       this.populateEvents()
        }
      }
    },

    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async unBookEvent(props) {
      const eventId=props.eventDialogData.id
      try {
        
        await unBook(eventId);
        
        
        props.closeEventDialog(eventId)
      } catch (error) {
        console.error('Error unbooking event:', error);
        if (error.response) {
          if (error.response.status === 500) {
            alert('Server error in unbooking. Please try again later.');
          } else if (error.response.status === 400) {
            alert('Invalid patients creadentials.');
          }
        }else {
        this.populateEvents()
        }
      }
    },

    closeDialog() {
      this.$emit('close-event-dialog');
    },

    async deleteEvent(eventId) {
      await deleteSlot(eventId);
      const index = this.events.findIndex(event => event.id === eventId)
      if (index !== -1) {
        this.events.splice(index, 1)
        this.calendarKey += 1
      }
      // TODO: send updated events back to DB
      // send notification to patient
    },
    editEvent() {
      const oldEvent = this.newEvent
      this.deleteEvent(oldEvent.id)
      /*
      // not allowing the changing of patient here
      // same id so same document in the DB
      */

      const startTime = this.newEventTime.startTime
      const endTime = this.newEventTime.endTime

      // store old times to use if not changed
      var formattedStartTime = oldEvent.time.start
      var formattedEndTime = oldEvent.time.end

      // format dates if changed
      if (this.newEventTime.startTime !== this.newEvent.time.start) {
        formattedStartTime = this.formatDate(startTime)
      }

      if (this.newEventTime.endTime !== this.newEvent.time.end) {
        formattedEndTime = this.formatDate(endTime)
      }

      // alert(`Formatted Start Time: ${formattedStartTime}\nFormatted End Time: ${formattedEndTime}`)

      // update newEvent with new dates
      this.newEvent.time.start = formattedStartTime
      this.newEvent.time.end = formattedEndTime
      /*
      // saving to DB
      // send notification to patient
      */
      this.events.push(this.newEvent)
      this.newEvent = {
        title: " ",
        with: " ",
        time: { start: " ", end: " " },
        colorScheme: " ",
        isEditable: true,
        id: " ",
        description: " "
      }
      this.calendarKey += 1
    },
    storeEvent(oldEventId) {
      try {
        this.newEventTime.startTime = new Date()
        this.newEventTime.endTime = new Date()
        this.showModal = !this.showModal
        this.newEvent = this.events.find((event) => event.id === oldEventId)
        this.newEventTime.startTime = this.newEvent.time.start
        this.newEventTime.endTime = this.newEvent.time.end
      } catch (err) {
        console.log(err)
      }

    },
    changeEventType(type) {
      this.newEvent.title = type;
    },
    changeColorScheme(colorScheme) {
      this.newEvent.colorScheme = colorScheme;
    },
    resetModal() {
      this.newEvent = {
        title: " ",
        with: " ",
        time: { start: " ", end: " " },
        colorScheme: " ",
        isEditable: true,
        id: " ",
        description: " "
      }
      this.newEventTime = {
        start: { date: "", time: "" },
        end: { date: "", time: "" }
      }
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = (`0${date.getMonth() + 1}`).slice(-2)
      const day = (`0${date.getDate()}`).slice(-2)
      const hours = (`0${date.getHours()}`).slice(-2)
      const minutes = (`0${date.getMinutes()}`).slice(-2)

      return `${year}-${month}-${day} ${hours}:${minutes}`
    }
  }

}
</script>
<style>
@import "qalendar/dist/style.css";
</style>

