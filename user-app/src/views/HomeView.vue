<template>
  <div class="container">
    <b-row class="row">
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      <!-- Left Section -->
      <div class="left-section">
        <b-col md="8">
          <div id="search">
            <!-- TODO: doesn't look the greatest but actual functionalities are more important -->
            <input
              type="input"
              v-model="searchInput"
              class="form-input"
              id="SearchInput"
              placeholder="Clinic Name"
            />
            <button type="searchButton" class="btn btn-primary" @click="Search()">Search</button>
          </div>
        </b-col>
        <b-col md="12">
          <!-- Map component -->
          <MapComponent
            ref="parentMapRef"
            :markers="markers"
            :center="userPosition"
            :zoom="12"
            :mapOptions="{
              zoomControl: true,
              mapTypeControl: true,
              scaleControl: true,
              streetViewControl: true,
              rotateControl: false,
              fullscreenControl: true
            }"
            :isInfoWindowVisible="isInfoWindowVisible"
            :infoWindowPosition="infoWindowPosition"
            :infoWindowOptions="infoWindowOptions"
            :infoWindowTitle="infoWindowTitle"
            :infoWindowContent="infoWindowContent"
            :infoWindowLink="infoWindowLink"
          />
        </b-col>
      </div>
      <!-- Right Section -->
      <div class="right-section">
        <b-col>
          <!-- Bookings -->
          <div class="bg-light p-5">
            <div class="card">
              <h5 class="bookingsHeader">My Bookings</h5>
              <br />
              <BookingListElement
                v-for="booking in bookings"
                :booking="booking"
                :key="booking.id"
                @click="showPopup(booking)"
              />
              <b-pagination
                class="pagination"
                :link-gen="generatePaginationLink"
                :total-rows="numPages"
                :align="center"
              ></b-pagination>
            </div>
          </div>

          <!-- Inbox --> 
        <!--  I commented this  cuz we have the inbox and the dropdowwn list
           <div class="bg-light p-5">        
            <div class="card">
              <h5 class="card-header" @click="goToInbox">Notifications</h5>
              <br />
              <NotificationListElement
                v-for="notification in notifications"
                :notification="notification"
                :key="notification.id"
              />
              <p :style="{ color: unreadMessages > 0 ? 'red' : 'black' }">
                {{ unreadMessages }} unread messages
              </p>
            </div>
          </div> -->

          <div class="bg-light p-5">
            <div class="card">
              <h5 class="card-header">Emergency</h5>
              <br />
              <small>Use our emergency booking system in case of a serious dental threat</small>
              <div class="my-1"></div>
              <router-link :to="{ path: '/emergency-form' }">
                <button
                  class="btn btn-primary"
                  style="width: 7.5rem; height: 2rem; font-size: 12px"
                >
                  Emergency Form
                </button>
              </router-link>
            </div>
          </div>
        </b-col>
      </div>
    </b-row>
  </div>
  <div v-if="isPopupVisible" id="popup-container">
    <b-card v-if="isPopupVisible" class="popupCard">
      <h5 class="card-header">{{ popupInfo.type }}</h5>
      <div class="card-body">
        <h5 class="card-title">{{ popupInfo.clinic.clinicName }}</h5>
        <p class="card-sub-title">{{ popupInfo.clinic.address }}</p>
        <p class="card-text">{{ popupInfo.date }}</p>
        <p class="card-text">{{ popupInfo.time }}</p>
        <p class="card-text">{{ popupInfo.description }}</p>
        <a class="btn btn-primary" @click="cancelBooking">Cancel</a>
      </div>
      <button id="close-button" @click="hidePopup">Close</button>
    </b-card>
  </div>
</template>

<script>
import MapComponent from '@/components/MapComponent.vue'
import BookingListElement from '@/components/BookingListElement.vue'
import NotificationListElement from '@/components/NotificationListElement.vue'
import { getUserNotifications } from '@/apis/notification'
import { getUserBookings } from '@/apis/booking'
import { getClinics } from '@/apis/clinic'
import { unBook } from '../apis/booking'
import { getUserInfo } from '../apis/users'

const CARDS_PER_PAGINATION = 1

export default {
  name: 'home-view',
  components: {
    MapComponent,
    BookingListElement,
    NotificationListElement
  },
  computed: {
    error() {
      return this.$store.state.errorMessage
    }
  },
  created() {
    this.$store.commit('SET_ERROR', null)
  },
  beforeUnmounty() {
    window.removeEventListener('resize', this.handleResize)
  },
  mounted() {
    this.fetchClinics()
    this.fetchBookings()
    this.fetchNotifications()
  },
  data() {
    return {
      userPosition: {},
      markers: [],
      numPages: 0,
      unreadMessages: 0,
      isPopupVisible: false,
      isInfoWindowVisible: false,
      infoWindowPosition: { lat: 51.5072, lng: 0.1276 },
      infoWindowOptions: { pixelOffset: { width: 0, height: -30 } },
      infoWindowTitle: 'InfoWindow Title',
      infoWindowContent: 'InfoWindow Content',
      infoWindowLink: '',
      searchInput: '',
      popupInfo: {},
      bookings: [],
      notifications: []
    }
  },
  methods: {
    useDefaultPosition() {
      const defaultPosition = { lat: 51.5072, lng: 0.1276 }
      this.userPosition = defaultPosition
      this.setMapCenter(defaultPosition)
      this.markers = this.computeMarkers()
    },
    setMapCenter(position) {
      this.infoWindowPosition = position
      if (this.$refs.map) {
        this.$refs.map.panTo(position)
      }
    },
    computeMarkers(userPosition) {
      const clinics = this.$store.getters.clinics || []
      const markers = clinics.map((clinic) => {
        return {
          id: clinic._id,
          position: {
            lat: clinic.position.lat,
            lng: clinic.position.lng
          },
          clinicName: clinic.clinicName,
          distance: this.calculateDistance(userPosition, {
            lat: clinic.position.lat,
            lng: clinic.position.lng
          })
        }
      })

      // Sort the markers by distance (nearest first)
      markers.sort((a, b) => a.distance - b.distance)

      return markers
    },
    calculateDistance(pos1, pos2) {
      // Implement a function to calculate the distance between two positions
      // You can use the Haversine formula or any other suitable method
      // Here's a simple example using Haversine formula:
      const R = 6371 // Radius of the Earth in kilometers
      const dLat = (pos2.lat - pos1.lat) * (Math.PI / 180)
      const dLon = (pos2.lng - pos1.lng) * (Math.PI / 180)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(pos1.lat * (Math.PI / 180)) *
          Math.cos(pos2.lat * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c
      return distance
    },
    generatePaginationLink(pageNum) {
      const offset = (pageNum - 1) * CARDS_PER_PAGINATION
      return `${this.$route.path}?offset=${offset}&limit=${CARDS_PER_PAGINATION}`
    },
    async fetchClinics() {
      try {
        this.$store.dispatch('fetchClinics').then(() => {
          // Try to get the user's current location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                // Successfully obtained the user's current position
                const latitude = position.coords.latitude
                const longitude = position.coords.longitude

                if (!isNaN(latitude) && !isNaN(longitude)) {
                  this.userPosition = { lat: latitude, lng: longitude }
                  this.setMapCenter(this.userPosition)
                  this.markers = this.computeMarkers(this.userPosition)
                } else {
                  this.useDefaultPosition()
                }
              },
              (error) => {
                console.error('Error getting user location:', error)
                this.useDefaultPosition()
              }
            )
          } else {
            // Geolocation is not supported by the browser
            console.error('Geolocation is not supported by your browser.')
            this.useDefaultPosition()
          }
        })
      } catch (error) {
        console.error('Error in fetchClinics of mounted hook:', error)
      }
    },
    async fetchNotifications() {
      try {
        const response = await getUserNotifications(0, 3)
        if (response) {
          console.log('notifications:', response)
          this.notifications = response
          this.totalNotifications = response.length //TODO: the totalNotifications should be a part of the response, since the length of the response is not the total number of notifications
          this.unreadMessages = this.notifications.filter(
            (notification) => !notification.read
          ).length
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    },
    async fetchBookings() {
      const user = await getUserInfo()
      try {
        const response = await getUserBookings(user.id)
        if (!response || !Array.isArray(response)) {
          console.error('No bookings received or invalid format')
          return // Exit if no bookings or response is not an array
        }
        const allClinics = await getClinics()
        for (let i = 0; i < response.length; i++) {
          const booking = response[i]
          const clinic = allClinics.find((clinic) => clinic._id === booking.clinic_id)
          // Assuming this is the start time from your booking
          const startString = booking.start

          // Create a Date object from the start string
          const startDate = new Date(startString)

          // Extract the date in YYYY-MM-DD format
          const date = startDate.toISOString().split('T')[0]

          // Extract the time in HH:MM format
          const time = startDate.toISOString().split('T')[1].substring(0, 5)

          console.log('Date:', date) // Outputs the date
          console.log('Time:', time) // Outputs the time
          if (clinic) {
            booking.clinic = clinic
            booking.date = date
            booking.time = time
          }
          this.bookings[i] = booking
        }
        this.numPages = Math.ceil(this.bookings.length / CARDS_PER_PAGINATION)
        console.log('bookings:', this.bookings)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    },
    Search() {
      try {
        console.log('Trying to search for ' + this.searchInput)
        const foundMarker = this.markers.find((marker) => marker.clinicName === this.searchInput)
        console.log(foundMarker)
        if (foundMarker) {
          this.$refs.parentMapRef.$refs.map.panTo(foundMarker.position)
          this.$refs.parentMapRef.showInfoWindow(foundMarker)
        } else {
          console.log('No marker found')
        }
      } catch (error) {
        console.log(error)
      }
    },
    goToInbox() {
      console.log('Go to inbox')
      this.$router.push('/inbox')
    },
    showPopup(booking) {
      this.isPopupVisible = true
      this.popupInfo = booking
      console.log(booking)
    },
    hidePopup() {
      this.isPopupVisible = false
      console.log('Hide popup')
    },
    cancelBooking() {
      unBook(this.popupInfo._id)
      window.location.reload()
    },
    handleResize() {
      if (this.$refs.map) {
        this.$refs.map.resize()
      }
    }
  }
}
</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}

#popup-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

#popup-content {
  background: #fff;
  padding: 20px;
  text-align: center;
}

.popupCard {
  width: 400px;
  height: 400px;
  background: #fff;
  padding: 20px;
  text-align: center;
}
.hidden {
  display: none;
}
.notification {
  border: 1px solid #ccc;
  padding: 5px;
  margin-bottom: 10px;
  /* Add more styles as needed */
}

.card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  height: auto;
  /* Add more styles as needed */
}

.bookingsHeader {
  text-align: center;
  margin-top: 10px;
}

button.page-link {
  z-index: 0 !important;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.left-section {
  width: 100%;
  flex: 1;
  align-content: center;
  justify-content: center;
}

.right-section {
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  height: 100%;
  flex: 1;
}

@media (max-width: 767px) {
  .right-section {
    display: none;
  }

  .left-section,
  .right-section {
    width: 100%;
  }
}
</style>
